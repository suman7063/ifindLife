
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  currency?: string;
  wallet_balance?: number;
  referral_code?: string;
  referrals_count?: number;
  referred_by?: string;
  favorites?: number[];
  favorite_experts?: number[] | string[];
  created_at?: string;
  updated_at?: string;
  auth_id?: string;
  profile_picture?: string;
}
