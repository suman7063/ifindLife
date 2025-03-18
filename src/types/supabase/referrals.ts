
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  rewardClaimed: boolean;
  referredName: string;
  
  // DB fields for compatibility
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  created_at: string;
  completed_at: string | null;
  reward_claimed: boolean;
}

export interface ReferralSettingsUI {
  id: string;
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description: string;
  updatedAt: string;
  
  // DB fields for compatibility
  referrer_reward: number;
  referred_reward: number;
  updated_at: string;
}
