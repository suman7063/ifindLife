
export interface UserProfile {
  id: string;
  auth_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  wallet_balance?: number;
  enrolled_courses?: number[];
  referral_code?: string;
  referral_link?: string;
}
