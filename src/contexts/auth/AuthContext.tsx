
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

// Import ExpertProfile from the correct location
import { ExpertProfile } from '@/types/supabase/expert';

// Define role types
export type UserRole = 'user' | 'expert' | 'admin' | null;

// Define authentication state
export interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Define authentication functions
export interface AuthFunctions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  expertLogin: (email: string, password: string) => Promise<boolean>;
  expertSignup: (registrationData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkUserRole: () => Promise<UserRole>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

// Combined context type
export interface AuthContextType extends AuthState, AuthFunctions {}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialAuthState: AuthState = {
  session: null,
  user: null,
  userProfile: null,
  expertProfile: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Initialize auth state and set up listeners
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        // Update basic session state immediately
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          isLoading: prev.isLoading && event !== 'INITIAL_SESSION', // Keep loading if first load
        }));
        
        // If we have a session, fetch the appropriate profile
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          // If no session, reset state
          setAuthState((prev) => ({
            ...prev,
            userProfile: null,
            expertProfile: null,
            role: null,
            isLoading: false,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      // If no session, we can finish loading immediately
      if (!session) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user data when authenticated
  const fetchUserData = async (userId: string) => {
    try {
      // First check if this is a regular user
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (userProfile) {
        setAuthState((prev) => ({
          ...prev,
          userProfile,
          expertProfile: null,
          role: userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user',
          isLoading: false,
        }));
        return;
      }
      
      // If not a regular user, check if it's an expert
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();
        
      if (expertProfile) {
        setAuthState((prev) => ({
          ...prev,
          userProfile: null,
          expertProfile: expertProfile as ExpertProfile,
          role: 'expert',
          isLoading: false,
        }));
        return;
      }
      
      // If neither user nor expert, we have an issue
      console.error("User authenticated but no profile found");
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  // Check user role
  const checkUserRole = async (): Promise<UserRole> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Check if user exists in profiles table
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userProfile) {
        return userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user';
      }

      // Check if user exists in expert_accounts table
      const { data: expertProfile } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (expertProfile) {
        return 'expert';
      }

      return null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (!data.user || !data.session) {
        toast.error("Login failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Signup function
  const signup = async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            country: userData.country,
            city: userData.city,
            referralCode,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      toast.success("Signup successful! Please check your email for verification.");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An error occurred during signup");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Expert login function
  const expertLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // First check if a user is already logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        // Check if it's already an expert session
        const { data: expertData } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', sessionData.session.user.id)
          .maybeSingle();
          
        if (expertData) {
          // Already logged in as expert
          toast.info("You are already logged in as an expert");
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return true;
        }
        
        // Not an expert, but logged in as something else - need to log out first
        toast.error("Please log out from your current session before logging in as an expert");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Now proceed with login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Expert login error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (!data.user || !data.session) {
        console.error("Expert login error: No user or session returned");
        toast.error("Login failed. Please try again.");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Check if the authenticated user is actually an expert
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', data.user.id)
        .maybeSingle();
        
      if (expertError || !expertProfile) {
        console.error("Expert login error:", expertError || "No expert profile found");
        toast.error("No expert account found for this user");
        
        // Sign out since this is not an expert
        await supabase.auth.signOut();
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Check if expert is approved
      if (expertProfile.status !== 'approved') {
        console.error(`Expert login error: Status is ${expertProfile.status}`);
        
        // Sign out since the expert is not approved
        await supabase.auth.signOut();
        
        if (expertProfile.status === 'pending') {
          toast.info('Your account is pending approval. You will be notified once approved.');
        } else {
          toast.error(`Your account has been ${expertProfile.status}. Please contact support.`);
        }
        
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      toast.success("Expert login successful!");
      return true;
    } catch (error: any) {
      console.error("Expert login error:", error);
      toast.error(error.message || "An error occurred during login");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Expert signup function
  const expertSignup = async (registrationData: any): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // This would be implemented according to the application's expert signup flow
      // For now, we'll just stub it out
      toast.info("Expert registration functionality will be implemented according to existing flow");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error("Expert signup error:", error);
      toast.error(error.message || "An error occurred during signup");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Clear auth state
      setAuthState({
        ...initialAuthState,
        isLoading: false,
      });
      
      toast.success("Logout successful!");
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "An error occurred during logout");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!authState.user || !authState.userProfile) {
        toast.error("No authenticated user found");
        return false;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();
        
      if (error) {
        console.error("Profile update error:", error);
        toast.error(error.message);
        return false;
      }
      
      // Update local state
      setAuthState((prev) => ({
        ...prev,
        userProfile: { ...prev.userProfile!, ...updates } as UserProfile,
      }));
      
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "An error occurred during profile update");
      return false;
    }
  };

  // Update expert profile
  const updateExpertProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      if (!authState.user || !authState.expertProfile) {
        toast.error("No authenticated expert found");
        return false;
      }
      
      const { data, error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('auth_id', authState.user.id)
        .select()
        .single();
        
      if (error) {
        console.error("Expert profile update error:", error);
        toast.error(error.message);
        return false;
      }
      
      // Update local state
      setAuthState((prev) => ({
        ...prev,
        expertProfile: { ...prev.expertProfile!, ...updates } as ExpertProfile,
      }));
      
      toast.success("Expert profile updated successfully");
      return true;
    } catch (error: any) {
      console.error("Expert profile update error:", error);
      toast.error(error.message || "An error occurred during profile update");
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password reset instructions sent to your email");
      return true;
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "An error occurred during password reset");
      return false;
    }
  };

  // Update password
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message);
        return false;
      }
      
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "An error occurred during password update");
      return false;
    }
  };

  // Define context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    expertLogin,
    expertSignup,
    logout,
    checkUserRole,
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
