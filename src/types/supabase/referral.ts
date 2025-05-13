
// Referral-related type definitions
export interface ReferralData {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  reward_claimed: boolean;
  created_at?: string;
  completed_at?: string;
}
