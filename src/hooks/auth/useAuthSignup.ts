
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthSignup = (
  setLoading: (loading: boolean) => void
) => {
  const [signupError, setSignupError] = useState<string | null>(null);

  const signup = async (email: string, password: string, userData?: any, referralCode?: string) => {
    try {
      setLoading(true);
      setSignupError(null);

      // Add referral code to user metadata if provided
      const metadata = {
        ...userData,
      };

      if (referralCode) {
        metadata.referred_by = referralCode;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error(`Registration failed: ${error.message}`);
        setSignupError(error.message);
        return false;
      }

      // If email confirmation is required
      if (!data.session) {
        toast.success('Registration successful! Please check your email for verification.');
      } else {
        toast.success('Registration successful!');
      }
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
      setSignupError(error.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    signupError
  };
};
