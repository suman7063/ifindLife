
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
  profile_picture?: string | null; // Alternative property name for avatar_url
  referral_code?: string;
  referred_by?: string | null;
  wallet_balance?: number;
  currency?: string;
  
  // Extended properties that might be populated by joins but not in the actual database table
  transactions?: any[];
  reports?: any[];
  reviews?: any[];
  enrolled_courses?: any[];
  favorite_experts?: any[];
  referrals?: any[];
  
  // Property aliases for backward compatibility
  walletBalance?: number; // Alias for wallet_balance
}

export interface ReferralSettings {
  id?: string | number;
  referrer_reward: number;
  referred_reward: number;
  enabled: boolean;
  active: boolean; // Compatibility with existing code
  description?: string;
  updated_at?: string;
}
