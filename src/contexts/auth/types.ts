
import { Session, User } from '@supabase/supabase-js';

// Define user roles
export type UserRole = 'user' | 'expert' | 'admin' | null;

// Define user profile structure
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  wallet_balance?: number | null;
  profile_picture?: string | null;
  currency?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any; // Allow additional properties
}

// Define expert profile structure
export interface ExpertProfile {
  id: string; // Change to string only to fix type issues
  auth_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  specialization?: string | null;
  experience?: string | null;
  bio?: string | null;
  certificate_urls?: string[] | null;
  profile_picture?: string | null;
  status: 'pending' | 'approved' | 'disapproved';
  average_rating?: number | null;
  reviews_count?: number | null;
  selected_services?: number[] | null;
  verified?: boolean | null;
  created_at?: string | null;
  [key: string]: any; // Allow additional properties
}

// Define authentication state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
}

// Define initial authentication state
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  userProfile: null,
  expertProfile: null,
  role: null,
  sessionType: 'none',
};
