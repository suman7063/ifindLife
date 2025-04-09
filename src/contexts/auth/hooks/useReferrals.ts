
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReferralInfo } from '@/types/user';

export const useReferrals = (user: any) => {
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);

  // Get user referrals
  const getReferrals = async (): Promise<ReferralInfo[]> => {
    if (!user) return [];
    
    try {
      // Get people user has referred
      const { data: referredUsers, error: referredError } = await supabase
        .from('referrals')
        .select(`
          id,
          created_at,
          status,
          referred_id,
          profiles:referred_id (
            name,
            email,
            avatar_url
          )
        `)
        .eq('referrer_id', user.id);
      
      if (referredError) {
        console.error('Error getting referrals:', referredError);
        return [];
      }
      
      // Format referral data
      const formattedReferrals = (referredUsers || []).map(ref => ({
        id: ref.id,
        userId: ref.referred_id,
        name: ref.profiles?.name || 'Unknown User',
        email: ref.profiles?.email || 'unknown@example.com',
        avatar: ref.profiles?.avatar_url,
        date: ref.created_at,
        status: ref.status
      }));
      
      setReferrals(formattedReferrals);
      return formattedReferrals;
    } catch (error) {
      console.error('Error getting referrals:', error);
      return [];
    }
  };

  const getReferralLink = (): string | null => {
    if (!user?.referral_code) {
      return null;
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?referralCode=${user.referral_code}`;
  };

  return {
    referrals,
    getReferrals,
    getReferralLink
  };
};
