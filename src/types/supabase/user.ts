
// User-related types for the application
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  created_at?: string;
  avatar_url?: string | null;
  referral_code?: string;
  referred_by?: string | null;
  wallet_balance?: number;
}

export interface ReferralSettings {
  id?: number;
  referrer_reward: number;
  referred_reward: number;
  enabled: boolean;
  updated_at?: string;
}
