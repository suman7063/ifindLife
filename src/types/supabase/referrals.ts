
// Types for Referrals in Supabase
import { Database } from '../supabase/tables';

// DB Type (snake_case)
export type ReferralDB = Database['public']['Tables']['referrals']['Row'];
export type ReferralSettingsDB = Database['public']['Tables']['referral_settings']['Row'];

// UI Type (camelCase)
export interface ReferralUI {
  id: string;
  referrerId: string;
  referrerName?: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: 'pending' | 'completed';
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
}

// Create adapter functions for converting between DB and UI formats
export const convertReferralToUI = (dbReferral: ReferralDB): ReferralUI => {
  return {
    id: dbReferral.id,
    referrerId: dbReferral.referrer_id,
    referredId: dbReferral.referred_id,
    referralCode: dbReferral.referral_code,
    status: dbReferral.status as 'pending' | 'completed',
    rewardClaimed: dbReferral.reward_claimed,
    createdAt: dbReferral.created_at,
    completedAt: dbReferral.completed_at
  };
};

export const convertReferralSettingsToUI = (dbSettings: ReferralSettingsDB): ReferralSettingsUI => {
  return {
    id: dbSettings.id,
    referrerReward: dbSettings.referrer_reward,
    referredReward: dbSettings.referred_reward,
    active: dbSettings.active,
    description: dbSettings.description || undefined
  };
};

export const convertReferralToDB = (uiReferral: ReferralUI): ReferralDB => {
  return {
    id: uiReferral.id,
    referrer_id: uiReferral.referrerId,
    referred_id: uiReferral.referredId,
    referral_code: uiReferral.referralCode,
    status: uiReferral.status,
    reward_claimed: uiReferral.rewardClaimed,
    created_at: uiReferral.createdAt,
    completed_at: uiReferral.completedAt
  } as ReferralDB;
};

export const convertReferralSettingsToDB = (uiSettings: ReferralSettingsUI): ReferralSettingsDB => {
  return {
    id: uiSettings.id,
    referrer_reward: uiSettings.referrerReward,
    referred_reward: uiSettings.referredReward,
    active: uiSettings.active,
    description: uiSettings.description || null,
    updated_at: new Date().toISOString()
  } as ReferralSettingsDB;
};
