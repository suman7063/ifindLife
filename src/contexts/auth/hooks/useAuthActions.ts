
import { useState, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { processReferralCode } from '@/utils/referralUtils';

export const useAuthActions = (fetchProfile: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { login: authLogin, signup: authSignup } = useSupabaseAuth();

  // Clean auth state before login
  const cleanAuthState = async (): Promise<void> => {
    console.log('User Auth: Cleaning auth state before login');
    
    try {
      // Sign out from Supabase to clear current session
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear any Supabase-related items from localStorage
      const storageKeys = Object.keys(localStorage);
      const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
      
      supabaseKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('User Auth: Auth state cleaned successfully');
    } catch (e) {
      console.warn('Error cleaning auth state:', e);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      console.log("Attempting login in context with:", email);
      
      // Clean auth state before login
      await cleanAuthState();
      
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      
      if (success) {
        try {
          // Fetch user profile after successful login
          await fetchProfile();
          console.log("Profile fetched successfully after login");
          toast.success('Login successful');
          
          // Redirect to user dashboard
          window.location.href = '/user-dashboard';
          return true;
        } catch (error) {
          console.error("Profile fetch error:", error);
          toast.error('Login successful but profile load failed. Please try again.');
          return false;
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
        return false;
      }
    } catch (error: any) {
      console.error("Login error in context:", error);
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }): Promise<boolean> => {
    console.log("Context: Attempting signup with:", userData.email);
    setActionLoading(true);
    
    try {
      // Clean auth state before signup
      await cleanAuthState();
      
      const success = await authSignup(userData);
      console.log("Context: Signup result:", success);
      
      // If signup was successful and there's a referral code, process it
      if (success && userData.referralCode) {
        try {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            await processReferralCode(userData.referralCode, data.user.id);
          }
        } catch (error) {
          console.error("Error processing referral:", error);
        }
      }
      
      if (success) {
        toast.success('Account created successfully! Please check your email to confirm your account');
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      return success;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = useCallback(async (): Promise<boolean> => {
    setActionLoading(true);
    try {
      console.log("Starting user logout process...");
      
      // First, sign out from Supabase (local scope to not affect other tabs)
      const { error } = await supabase.auth.signOut({
        scope: 'local'
      });
      
      if (error) {
        console.error("Error during Supabase logout:", error);
        toast.error('An error occurred during logout: ' + error.message);
        return false;
      }
      
      console.log("Supabase signOut completed");
      toast.success('Successfully logged out');
      
      // Redirect to homepage after logout
      window.location.href = '/';
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error('An error occurred during logout: ' + (error.message || 'Unknown error'));
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return { login, signup, logout, actionLoading };
};
