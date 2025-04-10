
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { UserSettings, ReferralInfo } from '@/types/user';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: any | null; // Using any for now, replace with ExpertProfile type when available
  isAuthenticated: boolean;
  isLoading: boolean;
  authLoading?: boolean; // For backward compatibility
  hasProfile: boolean;
  profileLoading: boolean;
  authError: string | null;
  profileError: string | null;
  role: UserRole;
  isExpertUser: boolean;
  expertId: string | null;
  favoritesCount: number;
  referrals: ReferralInfo[];
  userSettings: UserSettings | null;
  walletBalance: number;
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  authLoading: false,
  hasProfile: false,
  profileLoading: false,
  authError: null,
  profileError: null,
  role: null,
  isExpertUser: false,
  expertId: null,
  favoritesCount: 0,
  referrals: [],
  userSettings: null,
  walletBalance: 0
};

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites?: (expertId: string) => Promise<boolean>;
  removeFromFavorites?: (expertId: string) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  profileNotFound: boolean;
  updateProfilePicture: (file: File) => Promise<string | null>;
}
