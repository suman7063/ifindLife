
// Import the UserProfile from the supabase/user module
import { UserProfile } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/database/unified';

export type { UserProfile };

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole;
  profile?: UserProfile | null;
}

export interface UpdateProfileParams {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
  favorite_experts?: string[];
  favorite_programs?: string[] | number[];
  [key: string]: any; // Allow any additional properties for flexibility
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for backward compatibility
  expertProfile: ExpertProfile | null; 
  loading: boolean;
  isLoading: boolean; // Alias for backward compatibility
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
  
  // Authentication methods
  signIn: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signUp: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  
  // Aliases for backward compatibility
  login: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signup: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Profile management
  updateProfile: (updates: UpdateProfileParams) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  updatePassword?: (password: string) => Promise<boolean>;
  
  // Favorites management
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  
  // Wallet management
  rechargeWallet?: (amount: number) => Promise<boolean>;
  
  // Review and reporting
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  
  // Utility methods
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  
  // Session management
  clearSession: () => void;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
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
