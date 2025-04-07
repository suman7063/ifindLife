import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

import { ExpertProfile } from '@/types/supabase/expert';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
}

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

export interface AuthContextType extends AuthState, AuthFunctions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          isLoading: prev.isLoading && event !== 'INITIAL_SESSION',
        }));
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      if (!session) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserData = async (userId: string) => {
    try {
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

  const checkUserRole = async (): Promise<UserRole> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userProfile) {
        return userProfile.email === 'admin@ifindlife.com' ? 'admin' : 'user';
      }

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

  const expertLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        const { data: expertData } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', sessionData.session.user.id)
          .maybeSingle();
          
        if (expertData) {
          toast.info("You are already logged in as an expert");
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return true;
        }
        
        toast.error("Please log out from your current session before logging in as an expert");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
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
      
      const { data: expertProfile, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', data.user.id)
        .maybeSingle();
        
      if (expertError || !expertProfile) {
        console.error("Expert login error:", expertError || "No expert profile found");
        toast.error("No expert account found for this user");
        
        await supabase.auth.signOut();
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      
      if (expertProfile.status !== 'approved') {
        console.error(`Expert login error: Status is ${expertProfile.status}`);
        
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

  const expertSignup = async (registrationData: any): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
