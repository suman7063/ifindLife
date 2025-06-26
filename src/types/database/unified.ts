
// Unified types for the application
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  profile_picture: string;
  referral_code: string;
  referral_link: string;
  referred_by: string;
  wallet_balance: number;
  created_at: string;
  // Additional properties for user dashboard
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  reviews?: any[];
  recent_activities?: any[];
  upcoming_appointments?: any[];
  transactions?: any[];
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profile_picture?: string;
}

// Re-export from user types to maintain compatibility
export * from './user';
