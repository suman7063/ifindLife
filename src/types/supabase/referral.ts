
export interface ReferralSettings {
  id?: number;
  referrer_reward: number;
  referred_reward: number;
  description: string;
  enabled: boolean;
  max_referrals_per_user?: number;
  expiry_days?: number;
  code_length?: number;
  created_at?: string;
  updated_at?: string;
  active?: boolean;
}

export interface Referral {
  id: string | number;
  referrer_id: string;
  referred_id: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  created_at?: string;
  completed_at?: string | null;
  reward_claimed?: boolean;
}

export interface ReferralUI extends Referral {
  referred_name?: string;
  referred_email?: string;
  reward_amount?: number;
}
