
import { Referral } from '@/types/supabase/referral';
import { ReferralUI } from '@/types/supabase';

export const formatReferral = (referral: Referral): ReferralUI => {
  return {
    id: referral.id,
    referrerId: referral.referrer_id,
    referredId: referral.referred_id,
    referralCode: referral.referral_code,
    status: referral.status,
    rewardClaimed: referral.reward_claimed,
    createdAt: referral.created_at,
    completedAt: referral.completed_at
  };
};

export const formatReferrals = (referrals: Referral[]): ReferralUI[] => {
  return referrals.map(formatReferral);
};
