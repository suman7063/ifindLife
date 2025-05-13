
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

export interface AuthContextType {
  // Auth state
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for backward compatibility
  role: UserRole;
  expertProfile: ExpertProfile | null;
  walletBalance: number;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  
  // Auth methods
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  loginWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>; // Alias for backward compatibility
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<{ error: Error | null }>;
  
  // Profile methods
  getUserDisplayName: () => string;
  fetchProfile: () => Promise<UserProfile | null>;
  addFunds: (amount: number) => Promise<{ error: Error | null }>;
  updateWalletBalance: (newBalance: number) => Promise<{ error: Error | null }>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  
  // Expert methods
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<{ error: Error | null }>;
  fetchExpertProfile: () => Promise<ExpertProfile | null>;
  registerAsExpert: (data: any) => Promise<{ error: Error | null }>;
  
  // User actions
  addReview: (review: any) => Promise<boolean>;
  reportExpert: (report: any) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
  
  // Favorites
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
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
