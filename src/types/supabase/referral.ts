
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

// User referral info for context data
export interface ReferralInfo {
  id: string;
  referrer_id: string;
  referred_id: string;
  created_at: string;
  status: string;
  reward_claimed: boolean;
  user_info?: {
    name: string;
    email: string;
    avatar: string;
  };
}

export interface ReferralSettings {
  id?: string | number;
  referrer_reward: number;
  referred_reward: number;
  enabled: boolean;
  active: boolean; // Compatibility with existing code
  description?: string;
  updated_at?: string;
}
