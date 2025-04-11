
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  wallet_balance?: number;
  currency?: string;
  referral_code?: string;
  consultation_count?: number;
  referral_count?: number;
  
  // Extended properties - these may not exist in the database table
  // but are used for UI display after data joins
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  enrolled_courses?: any[];
  favorite_experts?: string[];
  
  // Legacy compatibility aliases
  walletBalance?: number; // Alias for wallet_balance
}

export interface UserSettings {
  user_id: string;
  theme_preference?: string;
  notification_preferences?: any;
  language_preference?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
  currency: string;
}

export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  bonus_amount?: number;
  currency: string;
  min_transaction_amount?: number;
  expires_in_days?: number;
  active: boolean;
  enabled?: boolean;
  description?: string;
}
