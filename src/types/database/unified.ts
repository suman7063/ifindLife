
// Import UserProfile from both sources to unify them
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

// Unified UserProfile type that includes properties from both with proper compatibility
export interface UserProfile {
  id: string;
  name: string; // Required in UserProfileA
  email: string; // Required in UserProfileA
  phone: string; // Required in UserProfileA
  city: string; // Required in UserProfileA
  country: string; // Required in UserProfileA
  profile_picture: string; // Required in UserProfileA
  wallet_balance: number; // Required in UserProfileA
  currency: string; // Required in UserProfileA
  created_at: string; // Required in UserProfileA
  updated_at?: string; // Optional
  referral_code: string; // Required in UserProfileA
  referral_link: string; // Required in UserProfileA
  referred_by: string | null; // Can be null in UserProfileA
  
  // Related data with compatibility for both types
  transactions?: any[];
  reviews?: any[];
  reports?: any[];
  favorite_experts: string[]; // Required in UserProfileA
  favorite_programs: string[]; // String[] in UserProfileA
  enrolled_courses: any[]; // Required in UserProfileA
  referrals?: any[];
  
  // Aliases for camelCase access (from UserProfileB)
  profilePicture?: string;
  walletBalance?: number;
  favoriteExperts?: string[];
  enrolledCourses?: any[];
  referralCode?: string;
}

// Expert profile from database
export interface ExpertProfile {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  status?: string;
}

// Unified message type with both snake_case and camelCase properties
export interface Message {
  id: string;
  sender_id: string; // Keep snake_case for database compatibility
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at?: string;
  
  // UI helpers
  isMine?: boolean;
  timestamp?: Date;
  // Add alias getters for camelCase access
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
}

// Transaction with unified properties
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
  type: string;
  transaction_type: string;
  currency: string;
  description?: string;
}

// Reviews with unified properties
export interface Review {
  id: string;
  user_id: string;
  expert_id: string | number;
  expertId?: string | number; // Alias
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  expert_name?: string;
  user_name?: string;
}

// Favorite experts
export interface Favorite {
  id: string;
  user_id: string;
  expert_id: string | number;
}
