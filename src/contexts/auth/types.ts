
import { User, Session } from '@supabase/supabase-js';

// Define user role and session types
export type UserRole = 'user' | 'expert' | 'admin' | null;
export type SessionType = 'none' | 'user' | 'expert' | 'dual';

// Define user profile types
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profile_picture?: string;
  wallet_balance?: number;
  created_at?: string;
  referral_code?: string;
  referred_by?: string;
  referral_link?: string;
  
  // Related data collections
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  transactions?: any[];
  reviews?: any[];
  reports?: any[];
  referrals?: any[];
}

// Define expert profile type with consistent ID as string
export interface ExpertProfile {
  id: string; // Always use string type for IDs
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
}

// Define auth state type
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: SessionType;
  expertFetchError?: string | null;
}

// Define initial auth state
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  userProfile: null,
  expertProfile: null,
  role: null,
  sessionType: 'none',
  expertFetchError: null
};
