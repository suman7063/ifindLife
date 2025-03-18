
import { supabase } from '@/lib/supabase';
import { ReferralSettings, ReferralUI } from '@/types/supabase/referrals';
import { toast } from 'sonner';

// Fetch referral settings
export const fetchReferralSettings = async (): Promise<ReferralSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching referral settings:', error);
      return null;
    }
    
    return {
      id: data.id,
      active: data.active,
      referrerReward: data.referrer_reward,
      referredReward: data.referred_reward,
      description: data.description || ''
    };
  } catch (error) {
    console.error('Error in fetchReferralSettings:', error);
    return null;
  }
};

// Process a referral code
export const processReferralCode = async (referralCode: string, newUserId: string): Promise<boolean> => {
  try {
    // First, find the user who owns this referral code
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();
      
    if (referrerError || !referrerData) {
      console.error('Error finding referrer:', referrerError);
      return false;
    }
    
    // Don't allow self-referrals
    if (referrerData.id === newUserId) {
      return false;
    }
    
    // Create a referral record
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
    
    // Update the new user to track who referred them
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by: referrerData.id })
      .eq('id', newUserId);
      
    if (updateError) {
      console.error('Error updating referred user:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

// Function to mark a referral as completed and distribute rewards
export const completeReferral = async (referralId: string): Promise<boolean> => {
  try {
    // Call the database function to handle the reward distribution
    const { data, error } = await supabase
      .rpc('handle_completed_referral', {
        p_referral_id: referralId
      });
      
    if (error) {
      console.error('Error completing referral:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in completeReferral:', error);
    return false;
  }
};

// Get referrals for a user (as referrer)
export const getUserReferrals = async (userId: string): Promise<ReferralUI[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referral_code,
        status,
        created_at,
        completed_at,
        reward_claimed,
        referred_id,
        referrer_id,
        users:referred_id (name, email)
      `)
      .eq('referrer_id', userId);
      
    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }
    
    // Format the referrals for UI
    return data.map(ref => ({
      id: ref.id,
      referrerId: ref.referrer_id,
      referredId: ref.referred_id,
      referralCode: ref.referral_code,
      status: ref.status,
      createdAt: ref.created_at,
      completedAt: ref.completed_at,
      rewardClaimed: ref.reward_claimed,
      referredUserName: ref.users?.name || 'Anonymous',
      referredUserEmail: ref.users?.email || '-'
    }));
  } catch (error) {
    console.error('Error in getUserReferrals:', error);
    return [];
  }
};

// Get referral link
export const getReferralLink = (referralCode?: string): string => {
  if (!referralCode) return '';
  return `${window.location.origin}/signup?ref=${referralCode}`;
};

// Copy referral link to clipboard
export const copyReferralLink = (link: string): void => {
  navigator.clipboard.writeText(link);
  toast.success('Referral link copied to clipboard!');
};

// Social sharing functions
export const shareViaTwitter = (referralCode: string): void => {
  const text = "I'm using iFindLife to connect with amazing experts! Join me using my referral link and get a bonus:";
  const link = getReferralLink(referralCode);
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
  window.open(url, '_blank');
};

export const shareViaFacebook = (referralCode: string): void => {
  const link = getReferralLink(referralCode);
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
  window.open(url, '_blank');
};

export const shareViaWhatsApp = (referralCode: string, name?: string): void => {
  const greeting = name ? `I'm ${name} and I'm` : "I'm";
  const text = `${greeting} using iFindLife to connect with experts! Join me using my referral link and get a bonus: `;
  const link = getReferralLink(referralCode);
  const url = `https://wa.me/?text=${encodeURIComponent(text + link)}`;
  window.open(url, '_blank');
};

export const shareViaEmail = (referralCode: string, name?: string): void => {
  const greeting = name ? `I'm ${name} and I'm` : "I'm";
  const subject = 'Join me on iFindLife';
  const body = `${greeting} using iFindLife to connect with professional experts and thought you might be interested. Use my referral link to join and get a bonus: ${getReferralLink(referralCode)}`;
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(url);
};
