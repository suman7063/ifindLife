
export interface UserProfile {
  id: string;
  name?: string; // Make name optional to match the other definition
  email?: string;
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
  walletBalance?: number; // Alias for wallet_balance
  enrolled_courses?: number[];
  enrolledCourses?: number[]; // Alias for enrolled_courses
  total_sessions?: number;
  last_login?: string;
  currency?: string;
  referral_link?: string;
  
  // Extended properties for UI
  favorite_experts?: any[];
  transactions?: any[];
  reports?: any[];
  reviews?: any[];
  referrals?: any[];
  consultation_count?: number;
  referral_count?: number;
}
