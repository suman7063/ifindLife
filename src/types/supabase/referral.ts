
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  updated_at: string;
  description?: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_claimed: boolean;
  created_at: string;
  completed_at?: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'cancelled';
  referred_name?: string; // Added for compatibility
}

export interface ReferralUI extends Referral {
  referred_name?: string;
  referrer_name?: string;
  reward_amount?: number;
}
