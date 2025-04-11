
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
