
import { supabase } from '@/lib/supabase';
import { Referral } from '@/types/supabase/referral';

/**
 * Generate a referral link with the given referral code
 */
export const getReferralLink = (referralCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${referralCode}`;
};

/**
 * Create a referral when a user signs up using a referral code
 */
export const createReferral = async (
  referrerId: string,
  referredId: string,
  referralCode: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        referral_code: referralCode,
        status: 'pending',
        reward_claimed: false
      });
    
    if (error) {
      console.error('Error creating referral:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception creating referral:', err);
    return false;
  }
};

/**
 * Find a referrer based on a referral code
 */
export const findReferrerByCode = async (
  referralCode: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();
    
    if (error || !data) {
      console.error('Error finding referrer:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Exception finding referrer:', err);
    return null;
  }
};

/**
 * Complete a referral and process rewards
 */
export const completeReferral = async (
  referralId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('handle_completed_referral', {
        p_referral_id: referralId
      });
    
    if (error) {
      console.error('Error completing referral:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception completing referral:', err);
    return false;
  }
};

/**
 * Fetch referrals for a user
 */
export const fetchUserReferrals = async (userId: string): Promise<Referral[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:users!referred_id(name, email)
      `)
      .eq('referrer_id', userId);
    
    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }
    
    return (data || []) as unknown as Referral[];
  } catch (err) {
    console.error('Exception fetching referrals:', err);
    return [];
  }
};

/**
 * Get referral statistics for a user
 */
export const getReferralStats = async (userId: string): Promise<{
  total: number;
  completed: number;
  pending: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('status')
      .eq('referrer_id', userId);
    
    if (error) {
      console.error('Error fetching referral stats:', error);
      return { total: 0, completed: 0, pending: 0 };
    }
    
    const total = data.length;
    const completed = data.filter(ref => ref.status === 'completed').length;
    const pending = data.filter(ref => ref.status === 'pending').length;
    
    return { total, completed, pending };
  } catch (err) {
    console.error('Exception fetching referral stats:', err);
    return { total: 0, completed: 0, pending: 0 };
  }
};
