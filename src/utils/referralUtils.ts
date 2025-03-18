
import { supabase } from '@/lib/supabase';

/**
 * Generates a unique referral code.
 * @returns {string} A unique referral code.
 */
export const generateReferralCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referralCode = '';
  for (let i = 0; i < 6; i++) {
    referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return referralCode;
};

/**
 * Creates a referral link using the generated referral code.
 * @param {string} referralCode - The referral code to be included in the link.
 * @returns {string} The referral link.
 */
export const createReferralLink = (referralCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?referralCode=${referralCode}`;
};

/**
 * Gets the referral link for a user
 * @param {string} referralCode - The referral code to generate link from
 * @returns {string} The formatted referral link
 */
export const getReferralLink = (referralCode: string): string => {
  return createReferralLink(referralCode);
};

/**
 * Copies the referral link to clipboard
 * @param {string} referralCode - The referral code to be copied
 * @returns {Promise<boolean>} - Success status of the copy operation
 */
export const copyReferralLink = async (referralCode: string): Promise<boolean> => {
  try {
    const link = createReferralLink(referralCode);
    await navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error("Failed to copy referral link:", error);
    return false;
  }
};

/**
 * Processes the referral code during user signup.
 * @param {string} referralCode - The referral code entered by the user.
 * @returns {Promise<boolean>} - Returns true if the referral code is valid and processed, false otherwise.
 */
export const processReferralCode = async (referralCode: string): Promise<boolean> => {
  if (!referralCode) {
    return false;
  }

  try {
    // Check if the referral code exists in the database
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (error) {
      console.error("Error checking referral code:", error);
      return false;
    }

    if (!data) {
      console.log("Referral code not found.");
      return false;
    }

    console.log("Referral code is valid. Referring user ID:", data.id);
    return true;
  } catch (error) {
    console.error("Error processing referral code:", error);
    return false;
  }
};

/**
 * Gets the current referral settings from the database
 * @returns {Promise<any>} - Referral settings object
 */
export const getReferralSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching referral settings:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getReferralSettings:", error);
    return null;
  }
};

/**
 * Gets the referrals for a user
 * @param {string} userId - The user ID to get referrals for
 * @returns {Promise<any[]>} - Array of referrals
 */
export const getUserReferrals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referrer_id,
        referred_id,
        status,
        created_at,
        completed_at,
        reward_claimed,
        users!referred_id(name, email, created_at)
      `)
      .eq('referrer_id', userId);
    
    if (error) {
      console.error("Error fetching user referrals:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserReferrals:", error);
    return [];
  }
};
