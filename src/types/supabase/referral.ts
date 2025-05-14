
// Referral related types
export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_claimed: boolean;
  created_at?: string;
  completed_at?: string;
}

// Referral UI related interfaces
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: string;
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

// Add the ReferralSettings interface with the required properties
export interface ReferralSettings {
  id?: string;
  referrer_reward: number;
  referred_reward: number;
  active?: boolean;
  description?: string;
  updated_at?: string;
}
