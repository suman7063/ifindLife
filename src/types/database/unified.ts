
// Import UserProfile from both sources to unify them
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

// Unified UserProfile type that includes properties from both with proper compatibility
export interface UserProfile {
  id: string;
  name: string; 
  email: string;
  phone: string;
  city: string;
  country: string;
  profile_picture: string | null;
  wallet_balance: number;
  currency: string;
  created_at: string;
  updated_at?: string;
  referral_code: string;
  referral_link: string;
  referred_by: string | null;
  
  // Related data with compatibility for both types (made flexible to handle string or number IDs)
  transactions: any[];
  reviews: any[];
  reports: any[];
  favorite_experts: string[] | number[]; // Support both string and number IDs
  favorite_programs: string[] | number[]; // Support both string and number IDs
  enrolled_courses: any[];
  referrals: any[];
  
  // Aliases for camelCase access (from UserProfileB)
  profilePicture?: string;
  walletBalance?: number;
  favoriteExperts?: string[] | number[];
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
  sender_id: string;
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
  review_id?: string; // Added to support data from database function
}

// Favorite experts
export interface Favorite {
  id: string;
  user_id: string;
  expert_id: string | number;
}

// Support requests
export interface SupportRequest {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  resolved_at?: string;
}
