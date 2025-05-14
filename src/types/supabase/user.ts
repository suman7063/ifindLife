
// User-specific types for Supabase integration

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture?: string;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
  referred_by?: string;
  referral_code?: string;
  referral_link?: string;
  currency?: string;
  
  // Optional nested data for joined queries
  favorite_experts?: string[];  // Changed to string[] for compatibility
  favorite_programs?: string[];
  enrolled_courses?: string[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
}

export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  theme_preference: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserAuthState {
  user: any; // Supabase user object
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}
