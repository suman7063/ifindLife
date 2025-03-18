
import { supabase } from '@/lib/supabase';
import { ReferralSettings, ReferralUI } from '@/types/supabase/referrals';
import { toast } from 'sonner';

export const getReferralLink = (code: string): string => {
  return `${window.location.origin}/register?ref=${code}`;
};

export const copyReferralLink = (link: string): void => {
  navigator.clipboard.writeText(link)
    .then(() => {
      toast.success('Referral link copied to clipboard');
    })
    .catch(() => {
      toast.error('Failed to copy link');
    });
};

export const getReferralSettings = async (): Promise<ReferralSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Convert from DB format to UI format
    return {
      id: data.id,
      referrerReward: data.referrer_reward,
      referredReward: data.referred_reward,
      active: data.active,
      description: data.description
    };
  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return null;
  }
};

export const shareViaEmail = (code: string): void => {
  const subject = 'Join me on iFindLife';
  const body = `I thought you might be interested in using iFindLife. Sign up using my referral code ${code} and get credits when you join! ${window.location.origin}/register?ref=${code}`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};

export const shareViaWhatsApp = (code: string): void => {
  const text = `Join me on iFindLife! Sign up using my referral code ${code} and get credits when you join: ${window.location.origin}/register?ref=${code}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};

export const shareViaTwitter = (code: string): void => {
  const text = `Join me on iFindLife! Sign up using my referral code ${code} and get credits when you join: ${window.location.origin}/register?ref=${code}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
};

export const shareViaFacebook = (code: string): void => {
  const url = `${window.location.origin}/register?ref=${code}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
};

export const getUserReferrals = async (userId: string): Promise<ReferralUI[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) {
      throw error;
    }

    // We need to get additional info about the referred users
    const referrals: ReferralUI[] = [];
    
    for (const referral of data) {
      // Get info about the referred user
      const { data: userData } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', referral.referred_id)
        .single();
      
      referrals.push({
        id: referral.id,
        referrerId: referral.referrer_id,
        referredId: referral.referred_id,
        referralCode: referral.referral_code,
        status: referral.status,
        createdAt: referral.created_at,
        completedAt: referral.completed_at,
        rewardClaimed: referral.reward_claimed,
        referredUserName: userData?.name || 'Unknown User',
        referredUserEmail: userData?.email || 'unknown@email.com'
      });
    }

    return referrals;
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
};
