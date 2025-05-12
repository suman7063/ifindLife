
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  currency?: string;
  wallet_balance?: number;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
  // Changed favorite_experts to string[] for consistency with other interfaces
  favorite_experts?: string[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
  profile_picture?: string;
}

export interface ExpertProfile {
  id: string;  // Changed to string only for consistency
  name: string;
  email: string;
  auth_id?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  userProfile: UserProfile | null;
  profile: UserProfile | null; // Alias for backward compatibility
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
}

export const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  session: null,
  authStatus: 'loading',
  userProfile: null,
  profile: null,
  expertProfile: null,
  role: null,
  sessionType: 'none',
  walletBalance: 0,
};

// Create a utility function to convert snake_case IDs to camelCase or vice versa
export function normalizeId(id: string | number): string {
  return String(id);
}
