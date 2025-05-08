
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile, UserRole } from '@/contexts/auth/types';

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile?: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  signup?: (email: string, password: string, userData?: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: number | string) => Promise<boolean>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (reviewParams: any) => Promise<boolean>;
  reportExpert?: (reportParams: any) => Promise<boolean>;
  getExpertShareLink?: (expertId: number | string) => string;
  getReferralLink?: () => string | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state and set up listener
  useEffect(() => {
    console.log("AuthContext: Initializing auth state");
    
    // Set up auth listener FIRST to catch any auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthContext: Auth state changed - ${event}`, session ? "Has session" : "No session");
        
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(async () => {
            await fetchUserData(session.user.id);
          }, 0);
        } else {
          // Clear auth state on sign out
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setExpertProfile(null);
          setRole(null);
          setIsAuthenticated(false);
          setSessionType('none');
        }
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log("AuthContext: Found existing session");
          setSession(data.session);
          setUser(data.session.user);
          setIsAuthenticated(true);
          
          await fetchUserData(data.session.user.id);
        } else {
          console.log("AuthContext: No existing session found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("AuthContext: Error during initialization", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      console.log("AuthContext: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user data (profile, role, etc.)
  const fetchUserData = async (userId: string) => {
    try {
      console.log("AuthContext: Fetching user data for userId", userId);
      
      // Fetch regular user profile
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // Not found error
        console.error("Error fetching user profile:", userError);
      }
      
      // Fetch expert profile (if exists)
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
      
      if (expertError && expertError.code !== 'PGRST116') { // Not found error
        console.error("Error fetching expert profile:", expertError);
      }

      // Ensure the expert data has the status property
      const expertProfile = expertData ? {
        ...expertData,
        status: expertData.status || 'pending'
      } as ExpertProfile : null;
      
      // Determine role and session type
      const hasUserProfile = !!userProfile;
      const hasExpertProfile = !!expertProfile && expertProfile.status === 'approved';
      
      let sessionType: 'none' | 'user' | 'expert' | 'dual' = 'none';
      let role: UserRole = null;
      
      if (hasUserProfile && hasExpertProfile) {
        sessionType = 'dual';
        // Default to user role for dual accounts
        role = 'user';
        
        // Check local storage for saved role preference
        const savedRole = localStorage.getItem('preferredRole');
        if (savedRole === 'expert' || savedRole === 'user') {
          role = savedRole as UserRole;
        }
      } else if (hasUserProfile) {
        sessionType = 'user';
        role = 'user';
      } else if (hasExpertProfile) {
        sessionType = 'expert';
        role = 'expert';
      }
      
      console.log("AuthContext: User data fetched", { 
        hasUserProfile, 
        hasExpertProfile, 
        sessionType, 
        role 
      });
      
      setUserProfile(userProfile || null);
      setExpertProfile(expertProfile);
      setSessionType(sessionType);
      setRole(role);
      
      // Store session type and role in local storage to persist across page refreshes
      localStorage.setItem('sessionType', sessionType);
      if (role) localStorage.setItem('preferredRole', role);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string, requestedRole?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log(`AuthContext: Attempting login for ${email}`);
      
      // Clean up any existing sessions before login
      const { data: existingSession } = await supabase.auth.getSession();
      if (existingSession.session) {
        console.log("AuthContext: Found existing session, signing out first");
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        return false;
      }
      
      if (!data.session) {
        console.error("Login failed: No session created");
        setError("Login failed: No session was created");
        return false;
      }
      
      console.log("AuthContext: Login successful, saving session");
      setSession(data.session);
      setUser(data.session.user);
      setIsAuthenticated(true);
      
      // User data will be fetched by the auth listener
      if (requestedRole) {
        localStorage.setItem('preferredRole', requestedRole);
      }
      
      return true;
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setError(error.message || "Unexpected login error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log("AuthContext: Logging out user");
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error("Logout error:", error);
        setError(error.message);
        return false;
      }
      
      // Clear auth state
      setIsAuthenticated(false);
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setExpertProfile(null);
      setRole(null);
      setSessionType('none');
      
      // Clear stored preferences
      localStorage.removeItem('preferredRole');
      
      console.log("AuthContext: Logout successful");
      return true;
    } catch (error: any) {
      console.error("Unexpected logout error:", error);
      setError(error.message || "Unexpected logout error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update User Profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      
      return true;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      setError(error.message || "Error updating profile");
      return false;
    }
  };
  
  // Update Expert Profile
  const updateExpertProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!user || !expertProfile) return false;
    
    try {
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('auth_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setExpertProfile(prev => prev ? { ...prev, ...updates } : null);
      
      return true;
    } catch (error: any) {
      console.error('Error updating expert profile:', error);
      setError(error.message || "Error updating profile");
      return false;
    }
  };

  // Auth context value
  const authContextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    session,
    userProfile,
    expertProfile,
    role,
    sessionType,
    error,
    login,
    logout,
    updateUserProfile,
    updateExpertProfile
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
