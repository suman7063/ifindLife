
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SignupData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  referralCode?: string;
}

export const useAuthActions = (fetchUserData: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);

  // Login function
  const login = async (email: string, password: string, roleOverride?: string): Promise<boolean> => {
    console.log('Login function called with email:', email, 'and role override:', roleOverride);
    
    try {
      setActionLoading(true);

      // Store login origin in session storage based on roleOverride
      if (roleOverride) {
        console.log('Setting login origin to:', roleOverride);
        sessionStorage.setItem('loginOrigin', roleOverride);
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        return false;
      }

      if (!data?.user || !data?.session) {
        console.error('Login failed: Missing user or session');
        toast.error('Login failed. Please try again.');
        return false;
      }

      console.log('Login successful for user:', data.user.email);
      
      // Fetch user data (profile, role, etc.)
      await fetchUserData();
      
      return true;
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error(error.message || 'An unexpected error occurred during login');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Signup function
  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setActionLoading(true);

      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || data.email.split('@')[0],
            phone: data.phone || '',
            country: data.country || '',
            city: data.city || ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }

      // If signup was successful
      if (authData.user) {
        toast.success('Signup successful! Please check your email for verification.');
        
        // Check if there's a referral code and process it
        if (data.referralCode) {
          try {
            // Process referral in a separate API call
            const { error: referralError } = await supabase.from('referrals').insert({
              referrer_id: data.referralCode,
              referred_id: authData.user.id,
              status: 'pending',
              reward_claimed: false
            });
            
            if (referralError) {
              console.error('Error processing referral:', referralError);
            }
          } catch (referralError) {
            console.error('Referral processing error:', referralError);
          }
        }
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast.error(error.message || 'An unexpected error occurred during signup');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setActionLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      console.error('Unexpected logout error:', error);
      toast.error(error.message || 'An unexpected error occurred during logout');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    actionLoading
  };
};
