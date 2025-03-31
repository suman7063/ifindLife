
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { processReferralCode } from '@/utils/referralUtils';

export const useAuthActions = (fetchProfile: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { login: authLogin, signup: authSignup } = useSupabaseAuth();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setActionLoading(true);
      console.log("Attempting login in context with:", email);
      const success = await authLogin(email, password);
      console.log("Login in context result:", success);
      
      if (success) {
        try {
          // Fetch user profile to check if it exists
          await fetchProfile();
          toast.success('Login successful');
          
          // Use window.location for a full page navigation to avoid React Router issues
          console.log("Redirecting to dashboard after successful login");
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
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/windows
      });
      
      if (error) {
        console.error("Error during Supabase logout:", error);
        toast.error('An error occurred during logout: ' + error.message);
        return false;
      }
      
      console.log("Supabase signOut completed");
      
      // Force a full page reload to clear any lingering state
      window.location.href = '/';
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
