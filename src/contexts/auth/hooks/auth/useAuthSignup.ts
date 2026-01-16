
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/database/unified';
import { getCurrencyFromCountry } from '@/hooks/useUserCurrency';
import { getReferralLink } from '@/utils/referralUtils';

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
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Determine currency based on country
        const currency = getCurrencyFromCountry(userData.country || null);
        
        // Generate unique referral code for the new user
        const generateCode = () => {
          return Math.random().toString(36).substring(2, 8).toUpperCase();
        };
        
        let referralCode = generateCode();
        let isUnique = false;
        let attempts = 0;
        
        // Check uniqueness and regenerate if needed
        while (!isUnique && attempts < 10) {
          const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode)
            .maybeSingle();
          
          if (!existing) {
            isUnique = true;
          } else {
            referralCode = generateCode();
            attempts++;
          }
        }
        
        // Generate referral link (store only relative path, not full URL)
        // Full URL will be generated dynamically using getReferralLink() when needed
        const referralLink = `/register?ref=${referralCode}`;
        
        // Create user profile with additional data
        const profileData = {
          ...userData,
          id: data.user.id,
          email,
          currency: currency, // Set currency based on country
          referred_by: null,
          referral_code: referralCode,
          referral_link: referralLink,  // Store relative path only (dynamic URL generated when needed)
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
