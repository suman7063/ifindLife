
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ReferralInfo } from '@/types/supabase/referral';
import { toast } from 'sonner';

export const useReferrals = (user: User | null) => {
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);
  
  const getReferrals = async (): Promise<ReferralInfo[]> => {
    if (!user) return [];
    
    try {
      // Fetch referrals made by the current user
      const { data: referralsData, error } = await supabase
        .from('referrals')
        .select(`
          id,
          referrer_id,
          referred_id,
          created_at,
          status,
          reward_claimed,
          users:referred_id (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .eq('referrer_id', user.id);
        
      if (error) {
        console.error('Error fetching referrals:', error);
        return [];
      }
      
      // Transform the data to match ReferralInfo structure
      const formattedReferrals: ReferralInfo[] = referralsData.map((ref: any) => ({
        id: ref.id,
        user_id: user.id,
        referral_code: '', // This would come from user profile/settings
        referrer_id: ref.referrer_id,
        referred_id: ref.referred_id,
        status: ref.status,
        created_at: ref.created_at,
        reward_claimed: ref.reward_claimed,
        user_info: ref.users ? {
          name: ref.users.name,
          email: ref.users.email,
          avatar: ref.users.avatar_url
        } : undefined
      }));
      
      setReferrals(formattedReferrals);
      return formattedReferrals;
    } catch (error) {
      console.error('Error in getReferrals:', error);
      return [];
    }
  };
  
  const getReferralLink = (): string | null => {
    if (!user) return null;
    
    // Get referral code from profile or generate one
    const referralCode = `REF${user.id.substring(0, 8)}`;
    
    // Construct the referral link
    return `${window.location.origin}/signup?ref=${referralCode}`;
  };
  
  const claimReferralReward = async (referralId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to claim rewards');
      return false;
    }
    
    try {
      // Update the referral to mark reward as claimed
      const { error } = await supabase
        .from('referrals')
        .update({ reward_claimed: true })
        .eq('id', referralId)
        .eq('referrer_id', user.id);
        
      if (error) {
        console.error('Error claiming reward:', error);
        toast.error('Failed to claim reward');
        return false;
      }
      
      // Update the local state
      setReferrals(prev => 
        prev.map(ref => 
          ref.id === referralId 
            ? { ...ref, reward_claimed: true } 
            : ref
        )
      );
      
      toast.success('Reward claimed successfully!');
      return true;
    } catch (error) {
      console.error('Error in claimReferralReward:', error);
      toast.error('Failed to claim reward');
      return false;
    }
  };
  
  return {
    referrals,
    getReferrals,
    getReferralLink,
    claimReferralReward
  };
};
