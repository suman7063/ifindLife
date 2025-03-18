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
 * Processes the referral code during user signup.
 * @param {string} referralCode - The referral code entered by the user.
 * @returns {Promise<boolean>} - Returns true if the referral code is valid and processed, false otherwise.
 */
export const processReferralCode = async (referralCode: string) => {
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
