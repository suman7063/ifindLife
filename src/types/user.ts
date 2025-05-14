
// Basic user type for consistent use across the application
export interface UserBasic {
  id: string;
  name: string;
  email?: string;
}

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
  referred_by?: string;
  referral_link?: string;
  created_at?: string;
}

export interface UserAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserBasic | null;
}
