
// Database schema type (snake_case)
export interface ReferralDb {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_claimed: boolean;
  created_at: string;
  completed_at?: string;
}

// UI schema type (camelCase)
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  rewardClaimed: boolean;
  createdAt: string;
  completedAt?: string;
}

// Database schema type (snake_case)
export interface ReferralSettingsDb {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description?: string;
  updated_at?: string;
}

// UI schema type (camelCase)
export interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
  updatedAt?: string;
}
