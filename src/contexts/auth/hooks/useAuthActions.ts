
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { processReferralCode } from '@/utils/referralUtils';
import { UserProfile } from '@/types/supabase';

export const useAuthActions = (fetchProfile: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, signup: authSignup, logout: authLogout } = useSupabaseAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      console.log("Attempting login in context with:", email);
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      
      if (success) {
        // Login successful, but we'll let the fetchProfile handle redirection
        // based on whether a profile exists or not
        toast.success('Login successful');
        return true;
      } else {
        toast.error('Login failed. Please check your credentials.');
        setActionLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error("Login error in context:", error);
      toast.error(error.message || 'Login failed. Please try again.');
      setActionLoading(false);
      throw error;
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

  const logout = async (): Promise<boolean> => {
    setActionLoading(true);
    try {
      console.log("Starting user logout process...");
      
      // First, ensure we sign out completely from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during Supabase logout:", error);
        toast.error('An error occurred during logout: ' + error.message);
        return false;
      }
      
      console.log("Supabase signOut completed");
      
      // Clear any local state that might be holding user info
      // navigate directly in this function, since we want immediate response
      // Don't redirect to home page, let the calling component decide
      toast.success('You have been logged out');
      return true;
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error('An error occurred during logout: ' + (error.message || 'Unknown error'));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return { login, signup, logout, actionLoading };
};
