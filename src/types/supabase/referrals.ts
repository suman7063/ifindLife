
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  rewardClaimed: boolean;
  createdAt: string;
  completedAt?: string;
  
  // DB format (snake_case)
  referrer_id?: string;
  referred_id?: string;
  referral_code?: string;
  reward_claimed?: boolean;
  created_at?: string;
  completed_at?: string;
}

export interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
  updatedAt?: string;
  
  // DB format (snake_case)
  referrer_reward?: number;
  referred_reward?: number;
  updated_at?: string;
}
