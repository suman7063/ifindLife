
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/hooks/expert-auth/types';

// Define types for the auth context
type UserRole = 'user' | 'expert' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  // Set up auth state listener and handle session
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          console.log("Auth state changed with user, fetching profile");
          // Use setTimeout to avoid potential Supabase auth deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          console.log("Auth state changed without user, clearing profiles");
          setUserProfile(null);
          setExpertProfile(null);
          setRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      if (session) {
        setSession(session);
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data including profiles and determine role
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for:", userId);
      
      // First check if this is a user
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (userProfile) {
        console.log("Found user profile:", userProfile.id);
        setUserProfile(userProfile);
        setExpertProfile(null);
        setRole(userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user');
        setIsLoading(false);
        return;
      }
      
      // Then check if it's an expert
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      if (expertProfile) {
        console.log("Found expert profile:", expertProfile.id);
        setUserProfile(null);
        setExpertProfile(expertProfile);
        setRole('expert');
        setIsLoading(false);
        return;
      }
      
      console.log("User authenticated but no profile found");
      setUserProfile(null);
      setExpertProfile(null);
      setRole(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Clear any existing session first
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        setIsLoading(false);
        return false;
      }
      
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setExpertProfile(null);
      setRole(null);
      
      return true;
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      if (role === 'user' || role === 'admin') {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
          
        if (error) {
          console.error("Profile update error:", error);
          return false;
        }
        
        // Update local state
        setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
        return true;
      }
      
      if (role === 'expert') {
        const { error } = await supabase
          .from('expert_accounts')
          .update(profileData)
          .eq('auth_id', user.id);
          
        if (error) {
          console.error("Expert profile update error:", error);
          return false;
        }
        
        // Update local state
        setExpertProfile(prev => prev ? { ...prev, ...profileData as any } : null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Unexpected profile update error:", error);
      return false;
    }
  };

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    session,
    userProfile,
    expertProfile,
    role,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
