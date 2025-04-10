
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { ReferralInfo } from '@/types/supabase/referral';

export const useReferrals = (user: User | null) => {
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);

  // Fetch user referrals
  const getReferrals = useCallback(async (): Promise<ReferralInfo[]> => {
    if (!user) return [];
    
    try {
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);
        
      if (error) {
        console.error('Error fetching referrals:', error);
        return [];
      }
      
      if (!referralsData || referralsData.length === 0) {
        setReferrals([]);
        return [];
      }
      
      // Get the referred user IDs
      const referredUserIds = referralsData.map(r => r.referred_id);
      
      // Fetch user data for the referred users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, profile_picture')
        .in('id', referredUserIds);
        
      if (usersError) {
        console.error('Error fetching referred users:', usersError);
      }
      
      // Combine referral data with user data
      const formattedReferrals = referralsData.map(ref => {
        const referredUser = usersData?.find(u => u.id === ref.referred_id) || null;
        
        return {
          id: ref.id,
          referrer_id: ref.referrer_id,
          referred_id: ref.referred_id,
          created_at: ref.created_at,
          status: ref.status,
          reward_claimed: ref.reward_claimed,
          user_info: referredUser ? {
            name: referredUser.name || 'Unknown User',
            email: referredUser.email || '',
            avatar: referredUser.profile_picture || ''
          } : undefined
        } as ReferralInfo;
      });
      
      setReferrals(formattedReferrals);
      return formattedReferrals;
    } catch (error) {
      console.error('Error in getReferrals:', error);
      return [];
    }
  }, [user]);
  
  // Generate a referral link for the current user
  const getReferralLink = useCallback((): string | null => {
    if (!user) return null;
    
    // Get the current domain
    const domain = window.location.origin;
    
    // Check if the user profile has a referral code
    const referralCode = user.user_metadata?.referral_code;
    if (!referralCode) return null;
    
    return `${domain}/register?ref=${referralCode}`;
  }, [user]);
  
  return {
    referrals,
    getReferrals,
    getReferralLink
  };
};
