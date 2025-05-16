
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/database/unified';

export const useAuthSignup = (onActionComplete: () => void) => {
  const signup = useCallback(async (
    email: string, 
    password: string, 
    userData: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create user profile with additional data
        const profileData = {
          ...userData,
          id: data.user.id,
          email,
          referred_by: null,
          referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        };

        // If referral code provided, find referrer and link
        if (referralCode) {
          const { data: referrerData } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode)
            .maybeSingle();

          if (referrerData) {
            profileData.referred_by = referrerData.id;
            
            // Create referral record
            await supabase.from('referrals').insert({
              referrer_id: referrerData.id,
              referred_id: data.user.id,
              referral_code: referralCode,
            });
          }
        }

        const { error: profileError } = await supabase
          .from('users')
          .insert([profileData]);

        if (profileError) {
          toast.error(`Failed to create profile: ${profileError.message}`);
          return false;
        }
      }

      localStorage.setItem('sessionType', 'user');
      toast.success('Account created successfully!');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  return { signup };
};
