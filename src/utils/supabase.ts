
import { supabase } from '../lib/supabase';

export const fetchReferralSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Error fetching referral settings: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchReferralSettings:', error);
    return null;
  }
};

export const fetchUserReferrals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:referred_id(name)
      `)
      .eq('referrer_id', userId);
    
    if (error) {
      throw new Error(`Error fetching user referrals: ${error.message}`);
    }
    
    return data.map(referral => ({
      ...referral,
      referred_name: referral.referred?.name || 'Unknown User'
    }));
  } catch (error) {
    console.error('Error in fetchUserReferrals:', error);
    return [];
  }
};

export const generateReferralCode = async (userId: string) => {
  try {
    // Check if user already has a referral code
    const { data: existingCode, error: checkError } = await supabase
      .from('user_referral_codes')
      .select('code')
      .eq('user_id', userId)
      .single();
    
    if (!checkError && existingCode) {
      return existingCode.code;
    }
    
    // Generate a new code
    const code = `${userId.substr(0, 6)}${Math.random().toString(36).substr(2, 6)}`.toUpperCase();
    
    // Save the code
    const { error } = await supabase
      .from('user_referral_codes')
      .insert({ user_id: userId, code });
    
    if (error) {
      throw new Error(`Error saving referral code: ${error.message}`);
    }
    
    return code;
  } catch (error) {
    console.error('Error in generateReferralCode:', error);
    return null;
  }
};

export const claimReferralReward = async (referralId: string) => {
  try {
    const { error } = await supabase
      .from('referrals')
      .update({ reward_claimed: true })
      .eq('id', referralId);
    
    if (error) {
      throw new Error(`Error claiming referral reward: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in claimReferralReward:', error);
    return false;
  }
};
