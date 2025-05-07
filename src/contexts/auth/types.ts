
import { Session, User } from '@supabase/supabase-js';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';

export type UserRole = 'user' | 'expert' | 'admin' | null;

// Updated UserProfile interface with referral_code
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  wallet_balance?: number;
  currency?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
}

// Updated ExpertProfile with required status field to match other definitions
export interface ExpertProfile {
  id?: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  status: 'pending' | 'approved' | 'disapproved'; // Made required to match other definitions
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: UserRole;
}

export const initialAuthState: AuthState = {
  session: null,
  user: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  role: null
};

export interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  error: string | null; // Added missing error property
  sessionType?: 'none' | 'user' | 'expert' | 'dual'; // Added missing sessionType property
  
  // Authentication methods
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  signup?: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>; // Changed return type from void to boolean
  expertSignup?: (data: any) => Promise<boolean>;
  expertLogin?: (email: string, password: string) => Promise<boolean>;
  
  // Profile methods
  updateProfile?: (data: Partial<UserProfile> | Partial<ExpertProfile>) => Promise<boolean>;
  updateUserProfile?: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile?: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword?: (password: string) => Promise<boolean>;
  
  // Expert interactions
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  
  // Review and reporting
  addReview?: (review: NewReview) => Promise<boolean>;
  reportExpert?: (report: NewReport) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
}
