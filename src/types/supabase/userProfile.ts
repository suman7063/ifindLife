
// User profile type definitions
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  wallet_balance?: number;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}
