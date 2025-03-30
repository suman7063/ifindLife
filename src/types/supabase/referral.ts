
// Referral program related types

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface ReferralSettingsUI {
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
}
