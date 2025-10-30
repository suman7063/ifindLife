
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
      .maybeSingle();

    if (error) throw error;
    return (data as ReferralSettings) ?? null;
  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return null;
  }
};

/**
 * Fetch user referrals from the database
 */
export const fetchUserReferrals = async (userId: string): Promise<any[]> => {
  try {
    // Fetch referrals where this user is the referrer
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) throw error;
    
    // Get the IDs of referred users
    const referredUserIds = referrals.map(referral => referral.referred_id);
    
    // If there are no referred users, return the referrals as is
    if (referredUserIds.length === 0) {
      return referrals;
    }
    
    // Get names of referred users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', referredUserIds);
      
    if (usersError) {
      console.error('Error fetching referred user names:', usersError);
      return referrals;
    }
    
    // Combine the data
    return formatReferrals(referrals, users || []);
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
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
      .maybeSingle();

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
