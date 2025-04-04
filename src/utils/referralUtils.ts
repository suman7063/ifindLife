
import { Referral } from '@/types/supabase/referral';
import { ReferralUI } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Base URL for referral links
const REFERRAL_BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;

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

/**
 * Generates a referral link from a referral code
 */
export const getReferralLink = (referralCode: string): string => {
  if (!referralCode) return '';
  return `${REFERRAL_BASE_URL}/register?referral=${referralCode}`;
};

/**
 * Copy referral link to clipboard
 */
export const copyReferralLink = (link: string): void => {
  navigator.clipboard.writeText(link)
    .then(() => {
      toast.success('Referral link copied to clipboard');
    })
    .catch(() => {
      toast.error('Failed to copy link to clipboard');
    });
};

/**
 * Process a referral code after a user signs up
 */
export const processReferralCode = async (referralCode: string, userId: string): Promise<boolean> => {
  if (!referralCode || !userId) return false;
  
  try {
    // First, check if the referral code is valid
    const { data: referrers, error: referrerError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();
    
    if (referrerError || !referrers) {
      console.error('Invalid referral code:', referralCode);
      return false;
    }
    
    // Create a new referral record
    const { error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrers.id,
        referred_id: userId,
        referral_code: referralCode,
        status: 'pending'
      });
      
    if (error) {
      console.error('Failed to create referral:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

/**
 * Fetch referral settings from database
 */
export const fetchReferralSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .eq('active', true)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching referral settings:', error);
    return null;
  }
};

/**
 * Fetch user's referrals
 */
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
        referred_profiles:referred_id(name)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Format the referrals with referred user names
    return data.map(referral => ({
      id: referral.id,
      referrerId: referral.referrer_id,
      referredId: referral.referred_id,
      referredName: referral.referred_profiles?.name,
      referralCode: referral.referral_code,
      status: referral.status,
      rewardClaimed: referral.reward_claimed,
      createdAt: referral.created_at,
      completedAt: referral.completed_at
    }));
    
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
};
