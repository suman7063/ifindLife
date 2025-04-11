import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/userProfile';
import { User } from '@supabase/supabase-js';
import { UserSettings } from '@/types/user';
import { ExpertProfile } from '@/types/expert';
import { Transaction } from '@/types/transaction';
import { ReferralInfo, ReferralUI } from '@/types/supabase/referral';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

export const fetchExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('expert_accounts')
      .select('*')
      .eq('auth_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching expert profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching expert profile:', error);
    return null;
  }
};

export const fetchUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
};

export const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const fetchReferrals = async (userId: string): Promise<ReferralUI[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        user_id,
        referral_code,
        referred_users (
          id,
          created_at,
          user_id,
          referrer_id,
          profiles (
            name,
            email,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }

    // Transform data to match ReferralUI interface
    const referrals: ReferralUI[] = [];
    
    data.forEach(ref => {
      if (ref.referred_users && Array.isArray(ref.referred_users)) {
        ref.referred_users.forEach((user: any) => {
          if (user.profiles) {
            referrals.push({
              id: user.id,
              name: user.profiles.name || 'Unknown',
              email: user.profiles.email || 'Unknown',
              avatar_url: user.profiles.avatar_url,
              status: 'completed',
              date: user.created_at,
              reward_amount: 100, // Sample value - replace with actual logic
              reward_status: 'pending'
            });
          }
        });
      }
    });

    return referrals;
  } catch (error) {
    console.error('Error in fetchReferrals:', error);
    return [];
  }
};
