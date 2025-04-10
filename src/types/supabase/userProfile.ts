
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  referred_by?: string;
  wallet_balance?: number;
  enrolled_courses?: number[];
  total_sessions?: number;
  last_login?: string;
}
