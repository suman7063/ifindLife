
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

// Unified UserProfile type that includes properties from both
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
  
  // Related data
  transactions?: any[];
  reviews?: any[];
  reports?: any[];
  favorite_experts?: string[];
  favorite_programs?: string[] | number[]; // Could be string[] or number[]
  enrolled_courses?: any[];
  referrals?: any[];
  
  // Aliases for camelCase access
  profilePicture?: string;
  walletBalance?: number;
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

// Unified message type
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
  // Camel case aliases for compatibility
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
  expertId: string | number;
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
