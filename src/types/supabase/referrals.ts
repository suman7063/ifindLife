
export interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
}

export type ReferralSettings = ReferralSettingsUI;

export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  rewardClaimed: boolean;
  referredUserName?: string;
  referredUserEmail?: string;
}

export type Referral = ReferralUI;

// Utility functions for converting between UI and DB formats
export function convertReferralSettingsToUI(dbSettings: any): ReferralSettingsUI {
  return {
    id: dbSettings.id,
    referrerReward: dbSettings.referrer_reward,
    referredReward: dbSettings.referred_reward,
    active: dbSettings.active,
    description: dbSettings.description
  };
}

export function convertReferralSettingsToDB(uiSettings: ReferralSettingsUI): any {
  return {
    id: uiSettings.id,
    referrer_reward: uiSettings.referrerReward,
    referred_reward: uiSettings.referredReward,
    active: uiSettings.active,
    description: uiSettings.description
  };
}
