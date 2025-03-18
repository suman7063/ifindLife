
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
