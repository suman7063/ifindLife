
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { UserSettings, ReferralInfo } from '@/types/user';

export interface AuthState {
  // User auth state
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: any | null;  // Using any to maintain compatibility
  
  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  profileLoading: boolean;
  authError: string | null;
  profileError: string | null;
  
  // Role information
  role: 'user' | 'expert' | null;
  isExpertUser: boolean;
  expertId: string | null;
  
  // User data
  favoritesCount: number;
  referrals: ReferralInfo[];
  userSettings: UserSettings | null;
  walletBalance: number;
}

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  authError: string | null;
  favoritesCount: number;
  referrals: ReferralInfo[];
  userSettings: UserSettings | null;
  walletBalance: number;
  hasProfile: boolean;
  profileLoading: boolean;
  profileError: string | null;
  isExpertUser: boolean;
  expertId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  checkIsFavorite: (expertId: string) => Promise<boolean>;
  refreshFavoritesCount: () => Promise<void>;
  getReferrals: () => Promise<ReferralInfo[]>;
  refreshWalletBalance: () => Promise<number>;
  addFunds: (amount: number) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  reviewExpert: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
}
