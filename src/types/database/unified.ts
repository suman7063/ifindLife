
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
  reports?: any[];
  referrals?: any[];
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

export interface ExpertProfile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience_years: number;
  hourly_rate: number;
  status: 'pending' | 'approved' | 'disapproved';
  profile_picture?: string;
  profilePicture?: string; // For backward compatibility
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

export interface AdminProfile {
  id: string;
  role: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

// Re-export from user types to maintain compatibility
export * from './user';
