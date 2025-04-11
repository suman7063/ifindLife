
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  enabled: boolean;
  active?: boolean;
  description: string;
}

export interface ReferralInfo {
  id: string;
  user_id: string;
  referred_id?: string;
  referral_code: string;
  status: string;
  created_at: string;
  referral_date?: string;
  reward_amount?: number;
  reward_status?: string;
  referrer_id?: string;
  reward_claimed?: boolean;
  user_info?: {
    name: string;
    email: string;
    avatar: string;
  };
}

export interface ReferralUI {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  status: string;
  date: string;
  reward_amount?: number;
  reward_status?: string;
  referredName?: string;
  rewardClaimed?: boolean;
  created_at?: string;
}
