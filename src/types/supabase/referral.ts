
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
