
import { supabase } from '@/lib/supabase';
import { ReferralSettings, Referral, ReferralUI } from '@/types/supabase';
import { toast } from 'sonner';

// Fetch the current referral program settings
export const fetchReferralSettings = async (): Promise<ReferralSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching referral settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return null;
  }
};

// Fetch referrals made by a user
export const fetchUserReferrals = async (userId: string): Promise<ReferralUI[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referrer_id,
        referred_id,
        referral_code,
        status,
        reward_claimed,
        created_at,
        completed_at,
        users!referred_id(name, email)
      `)
      .eq('referrer_id', userId);

    if (error) {
      console.error('Error fetching user referrals:', error);
      return [];
    }

    // Transform to UI-friendly format
    return data.map(item => ({
      id: item.id,
      referrerId: item.referrer_id,
      referredId: item.referred_id,
      referredName: item.users?.name || 'Anonymous',
      referralCode: item.referral_code,
      status: item.status as 'pending' | 'completed' | 'expired',
      rewardClaimed: item.reward_claimed,
      createdAt: item.created_at,
      completedAt: item.completed_at
    }));
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
};

// Generate a shareable referral link
export const getReferralLink = (code: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${code}`;
};

// Process a referral code during signup
export const processReferralCode = async (
  referralCode: string, 
  newUserId: string
): Promise<boolean> => {
  try {
    // Find referrer by code
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      console.error('Invalid referral code or referrer not found:', referrerError);
      return false;
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id: newUserId,
        referral_code: referralCode,
        status: 'pending'
      });

    if (referralError) {
      console.error('Error creating referral record:', referralError);
      return false;
    }

    // Update user with referred_by
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by: referrer.id })
      .eq('id', newUserId);

    if (updateError) {
      console.error('Error updating user with referrer:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error processing referral code:', error);
    return false;
  }
};

// Complete a referral after first purchase
export const completeReferral = async (referralId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('handle_completed_referral', { p_referral_id: referralId });

    if (error) {
      console.error('Error completing referral:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error completing referral:', error);
    return false;
  }
};

// Copy referral link to clipboard
export const copyReferralLink = (link: string): void => {
  navigator.clipboard.writeText(link)
    .then(() => {
      toast.success('Referral link copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy referral link');
    });
};

// Share referral via different platforms
export const shareViaEmail = (referralCode: string, userName: string = 'I'): void => {
  const subject = encodeURIComponent('Join iFindLife with my referral code');
  const referralLink = getReferralLink(referralCode);
  const body = encodeURIComponent(
    `Hi there,\n\n${userName} thought you might be interested in iFindLife. Sign up using my referral code ${referralCode} or click this link: ${referralLink}\n\nYou'll get a bonus credit in your wallet after your first purchase!\n\nRegards,\n${userName}`
  );
  
  window.open(`mailto:?subject=${subject}&body=${body}`);
};

export const shareViaWhatsApp = (referralCode: string, userName: string = 'I'): void => {
  const referralLink = getReferralLink(referralCode);
  const text = encodeURIComponent(
    `Hey! ${userName} invites you to join iFindLife. Use my referral code ${referralCode} or sign up with this link: ${referralLink} to get bonus credits!`
  );
  
  window.open(`https://wa.me/?text=${text}`);
};

export const shareViaTwitter = (referralCode: string): void => {
  const referralLink = getReferralLink(referralCode);
  const text = encodeURIComponent(
    `Join iFindLife using my referral code ${referralCode} and get bonus credits! Sign up here: ${referralLink}`
  );
  
  window.open(`https://twitter.com/intent/tweet?text=${text}`);
};
