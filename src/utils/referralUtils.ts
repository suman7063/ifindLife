
import { supabase } from '@/lib/supabase';
import { ReferralSettingsUI, ReferralUI, convertReferralSettingsToUI } from '@/types/supabase/referrals';
import { toast } from 'sonner';

// Process a referral code for a new user
export async function processReferralCode(referralCode: string, userId: string): Promise<boolean> {
  try {
    // 1. Find the referral record with the given code
    const { data: referrals, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('status', 'pending');
      
    if (referralError || !referrals || referrals.length === 0) {
      console.error('Invalid referral code:', referralError || 'No pending referrals found');
      return false;
    }
    
    // 2. Update the referral record to associate it with the new user
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        referred_id: userId,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referrals[0].id);
      
    if (updateError) {
      console.error('Error updating referral:', updateError);
      return false;
    }
    
    // 3. Process rewards
    const { data: success, error: rewardError } = await supabase
      .rpc('handle_completed_referral', { p_referral_id: referrals[0].id });
      
    if (rewardError) {
      console.error('Error processing rewards:', rewardError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
}

// Fetch referral settings
export async function getReferralSettings(): Promise<ReferralSettingsUI | null> {
  try {
    const { data, error } = await supabase
      .from('referral_settings')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching referral settings:', error);
      return null;
    }
    
    return convertReferralSettingsToUI(data);
  } catch (error) {
    console.error('Error in getReferralSettings:', error);
    return null;
  }
}

// Create a referral link for a user
export function generateReferralLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${referralCode}`;
}

// Copy referral link to clipboard
export function copyReferralLink(referralLink: string): boolean {
  try {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.error('Failed to copy link. Please try again.');
    return false;
  }
}

// Get the user's referrals
export async function getUserReferrals(userId: string): Promise<ReferralUI[]> {
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
        users!referred_id(id, name, email)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }
    
    // Convert to UI format
    return data.map(item => {
      const referredUser = item.users || {};
      
      return {
        id: item.id,
        referrerId: userId,
        referredId: item.referred_id,
        referralCode: item.referral_code,
        status: item.status,
        createdAt: item.created_at,
        completedAt: item.completed_at,
        rewardClaimed: item.reward_claimed,
        referredUserName: referredUser.name,
        referredUserEmail: referredUser.email
      };
    });
  } catch (error) {
    console.error('Error in getUserReferrals:', error);
    return [];
  }
}

// Create a new referral
export async function createReferral(userId: string, email: string): Promise<boolean> {
  try {
    // Generate a random referral code
    const referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    const { error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: userId,
        referred_id: null,
        referral_code: referralCode,
        status: 'pending'
      });
      
    if (error) {
      console.error('Error creating referral:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createReferral:', error);
    return false;
  }
}

// This function will be used by the UserAuthContext
export function getReferralLink(referralCode: string): string {
  return generateReferralLink(referralCode);
}
