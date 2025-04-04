
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile, ReferralSettings } from '@/types/supabase';

/**
 * Generates a referral link from a referral code
 */
export const getReferralLink = (referralCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/register?ref=${referralCode}`;
};

/**
 * Copies the referral link to clipboard
 */
export const copyReferralLink = (link: string): boolean => {
  try {
    navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Fetches referral settings from the database
 */
export const fetchReferralSettings = async (): Promise<ReferralSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    return data as ReferralSettings;
  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return null;
  }
};

/**
 * Process a referral code when a user signs up
 */
export const processReferralCode = async (referralCode: string, userId: string): Promise<boolean> => {
  try {
    // First check if the referral code exists and get the referrer's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (userError || !userData) {
      console.error('Invalid referral code or error:', userError);
      return false;
    }

    const referrerId = userData.id;

    // Create a referral record
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: userId,
        referral_code: referralCode,
        status: 'pending',
        reward_claimed: false
      });

    if (insertError) throw insertError;
    
    // Update the user's referred_by field
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by: referrerId })
      .eq('id', userId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

/**
 * Format referrals data for UI display
 */
export const formatReferrals = (referrals: any[], users: any[]): any[] => {
  if (!referrals || !users) return [];
  
  return referrals.map(referral => {
    // Find the referred user to get their name
    const referredUser = users.find(user => user.id === referral.referred_id);
    
    return {
      id: referral.id,
      referrerId: referral.referrer_id,
      referredId: referral.referred_id,
      referredName: referredUser ? referredUser.name : 'Unknown User',
      referralCode: referral.referral_code,
      status: referral.status,
      rewardClaimed: referral.reward_claimed,
      createdAt: referral.created_at,
      completedAt: referral.completed_at
    };
  });
};
