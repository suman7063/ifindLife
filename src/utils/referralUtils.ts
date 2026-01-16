
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
    
    // Map currency-specific fields for backward compatibility
    const settings = data as any;
    if (settings) {
      return {
        ...settings,
        // For backward compatibility, use INR values as default
        referrer_reward: settings.referrer_reward_inr ?? 10,
        referred_reward: settings.referred_reward_inr ?? 5,
      } as ReferralSettings;
    }
    
    return null;
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
    console.log('🔍 processReferralCode called:', { referralCode, userId });
    
    // First check if the referral code exists and get the referrer's ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();

    console.log('🔍 Referral code lookup result:', { userData, userError });

    if (userError || !userData) {
      console.error('❌ Invalid referral code or error:', userError);
      return false;
    }

    const referrerId = userData.id;
    console.log('✅ Found referrer:', referrerId);

    // Create a referral record
    const referralData = {
      referrer_id: referrerId,
      referred_id: userId,
      referral_code: referralCode,
      status: 'pending',
      reward_claimed: false
    };
    
    console.log('🔍 Inserting referral record:', referralData);
    const { error: insertError } = await supabase
      .from('referrals')
      .insert(referralData);

    if (insertError) {
      console.error('❌ Error inserting referral record:', insertError);
      throw insertError;
    }
    
    console.log('✅ Referral record created successfully');
    
    // Update the user's referred_by field
    console.log('🔍 Updating user referred_by:', { userId, referrerId });
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by: referrerId })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error updating user referred_by:', updateError);
      throw updateError;
    }

    console.log('✅ User referred_by updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error processing referral:', error);
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
