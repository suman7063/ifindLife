
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  wallet_balance?: number;
  currency?: string;
  profile_picture?: string;
  referral_code?: string;
  referral_link?: string;
  favorite_experts?: (string | number)[];
  favorite_programs?: number[];
  created_at?: string;
}
