
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';
import { AuthContextType, UserRole } from './types';

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
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');

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
          setSessionType('none');
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
      
      // IMPORTANT: Check for expert profile FIRST (changed order)
      const { data: expertProfileData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();

      // For debugging
      console.log("Expert profile check result:", expertProfileData, expertError);
        
      if (expertProfileData) {
        console.log("Found expert profile:", expertProfileData.id);
        // Ensure the status field is cast properly to match the expected type
        const typedExpertProfile: ExpertProfile = {
          ...expertProfileData,
          status: (expertProfileData.status as 'pending' | 'approved' | 'disapproved') || 'pending'
        };
        
        setExpertProfile(typedExpertProfile);
        setUserProfile(null);
        setRole('expert');
        setSessionType('expert');
        setIsLoading(false);
        return;
      }
      
      // Then check if this is a regular user
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
        setSessionType('user');
        setIsLoading(false);
        return;
      }
      
      console.log("User authenticated but no profile found");
      setUserProfile(null);
      setExpertProfile(null);
      setRole(null);
      setSessionType('none');
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

  // Expert login - same as regular login but keeping for API compatibility
  const expertLogin = async (email: string, password: string): Promise<boolean> => {
    return login(email, password);
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

  // Expert signup - for compatibility
  const expertSignup = async (registrationData: any): Promise<boolean> => {
    return signup(registrationData.email, registrationData.password, registrationData);
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
      setSessionType('none');
      
      return true;
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Update profile function (generic)
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      if (role === 'user' || role === 'admin') {
        return updateUserProfile(profileData);
      }
      
      if (role === 'expert') {
        // Cast is needed because these types have some differences
        return updateExpertProfile(profileData as any);
      }
      
      return false;
    } catch (error) {
      console.error("Unexpected profile update error:", error);
      return false;
    }
  };

  // Update user profile function
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
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
    } catch (error) {
      console.error("User profile update error:", error);
      return false;
    }
  };

  // Update expert profile function
  const updateExpertProfile = async (profileData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Ensure experience is always a string
      if (profileData.experience !== undefined && typeof profileData.experience !== 'string') {
        profileData.experience = String(profileData.experience);
      }
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(profileData)
        .eq('auth_id', user.id);
        
      if (error) {
        console.error("Expert profile update error:", error);
        return false;
      }
      
      // Update local state - ensure types are preserved
      setExpertProfile(prev => {
        if (!prev) return null;
        const updated = { 
          ...prev, 
          ...profileData
        };
        
        // Ensure status maintains its correct type
        const status = updated.status as 'pending' | 'approved' | 'disapproved' | undefined;
        
        return {
          ...updated,
          status: status || 'pending'
        };
      });
      
      return true;
    } catch (error) {
      console.error("Expert profile update error:", error);
      return false;
    }
  };

  // Update password function
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Password update error:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected password update error:", error);
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error("Password reset error:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      return false;
    }
  };

  // Check user role
  const checkUserRole = async (): Promise<UserRole> => {
    if (!user) return null;
    
    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
      
    if (adminData) return 'admin';
    
    // Check if user is an expert
    const { data: expertData } = await supabase
      .from('expert_accounts')
      .select('id')
      .eq('auth_id', user.id)
      .maybeSingle();
      
    if (expertData) return 'expert';
    
    // Check if user is a regular user
    const { data: userData } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (userData) return 'user';
    
    return null;
  };

  // Placeholder methods for expert interactions
  const addToFavorites = async (expertId: number): Promise<boolean> => false;
  const removeFromFavorites = async (expertId: number): Promise<boolean> => false;
  const rechargeWallet = async (amount: number): Promise<boolean> => false;
  const hasTakenServiceFrom = async (expertId: string): Promise<boolean> => false;
  const getExpertShareLink = (expertId: string | number): string => '';
  const getReferralLink = (): string | null => null;

  // Review functions
  const addReview = async (reviewOrExpertId: any, rating?: number, comment?: string): Promise<boolean> => {
    return false;
  };

  // Report functions
  const reportExpert = async (reportOrExpertId: any, reason?: string, details?: string): Promise<boolean> => {
    return false;
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    isLoading,
    user,
    session,
    userProfile,
    expertProfile,
    role,
    login,
    expertLogin,
    signup,
    expertSignup,
    logout,
    updateProfile,
    updateUserProfile,
    updateExpertProfile,
    updatePassword,
    resetPassword,
    checkUserRole,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    currentUser: userProfile,
    currentExpert: expertProfile,
    authLoading: isLoading,
    sessionType,
    error: null
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
