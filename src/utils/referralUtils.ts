
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReferralSettingsUI, convertReferralSettingsToUI, ReferralUI, convertReferralToUI } from '@/types/supabase/referrals';

// Function to fetch referral settings
export const fetchReferralSettings = async (): Promise<ReferralSettingsUI> => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return convertReferralSettingsToUI(data);
  } catch (error: any) {
    console.error('Error fetching referral settings:', error);
    // Return default values if settings are not found
    return {
      id: '',
      referrerReward: 10,
      referredReward: 5,
      active: true,
      description: 'Invite friends and earn rewards when they make their first purchase.'
    };
  }
};

// Function to fetch user's referrals
export const fetchUserReferrals = async (userId: string): Promise<ReferralUI[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);
    
    if (error) throw error;
    
    // Convert snake_case to camelCase
    const referrals = data.map(referral => convertReferralToUI(referral));
    
    // If we need more user details, we could fetch them here
    const enhancedReferrals = await Promise.all(referrals.map(async (referral) => {
      // Get referred user's name
      if (referral.referredId) {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', referral.referredId)
          .single();
        
        return {
          ...referral,
          referredName: userData?.name || 'Unknown User'
        };
      }
      
      return referral;
    }));
    
    return enhancedReferrals;
  } catch (error: any) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
};

// Function to generate and get referral link
export const getReferralLink = (referralCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${referralCode}`;
};

// Function to copy referral link to clipboard
export const copyReferralLink = (link: string): void => {
  navigator.clipboard.writeText(link)
    .then(() => {
      toast.success('Referral link copied to clipboard!');
    })
    .catch((error) => {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link. Please try again.');
    });
};

// Function to share via email
export const shareViaEmail = (referralCode: string, userName: string): void => {
  const link = getReferralLink(referralCode);
  const subject = `Join me on iFind Life - from ${userName}`;
  const body = `Hey there! I'm using iFind Life to connect with expert advisors. Join using my referral link and we both get rewards: ${link}`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  toast.success('Email sharing opened');
};

// Function to share via WhatsApp
export const shareViaWhatsApp = (referralCode: string, userName: string): void => {
  const link = getReferralLink(referralCode);
  const text = `Hey! I'm using iFind Life to connect with expert advisors. Join using my referral link and we both get rewards: ${link}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  toast.success('WhatsApp sharing opened');
};

// Function to share via Twitter
export const shareViaTwitter = (referralCode: string): void => {
  const link = getReferralLink(referralCode);
  const text = 'I'm using iFind Life to connect with expert advisors. Join using my referral link and we both get rewards!';
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`);
  toast.success('Twitter sharing opened');
};

// Function to validate referral code on signup
export const validateReferralCode = async (referralCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating referral code:', error);
    return false;
  }
};

// Function to register referral when a user signs up with a referral code
export const registerReferral = async (referralCode: string, newUserId: string): Promise<boolean> => {
  try {
    // Find the user with this referral code
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();
    
    if (referrerError || !referrerData) {
      console.error('Error finding referrer:', referrerError);
      return false;
    }
    
    // Create a new referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerData.id,
        referred_id: newUserId,
        referral_code: referralCode,
        status: 'pending',
        reward_claimed: false
      });
    
    if (referralError) {
      console.error('Error creating referral record:', referralError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error registering referral:', error);
    return false;
  }
};
