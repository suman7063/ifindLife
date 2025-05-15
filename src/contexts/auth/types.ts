
import { Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  profile: null,
  userProfile: null,
  expertProfile: null,
  loading: true,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  role: null,
  sessionType: 'none',
  walletBalance: 0
};

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  
  // Extended functions for specific user workflows
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  updateProfilePicture?: (file: File) => Promise<string | null>;
}
