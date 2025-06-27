
import { Session } from '@supabase/supabase-js';

export interface LoginOptions {
  asExpert?: boolean;
  redirectTo?: string;
  remember?: boolean;
}

export type UserRole = 'user' | 'expert' | 'admin' | null;
export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  userProfile: any | null;
  expertProfile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  session: Session | null;
  error: Error | null;
  walletBalance: number;
  profile: any | null; // For backward compatibility
  sessionType: SessionType;
  hasUserAccount: boolean;
}

// Add the initialAuthState that was missing
export const initialAuthState: AuthState = {
  user: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  session: null,
  error: null,
  walletBalance: 0,
  profile: null,
  sessionType: 'none',
  hasUserAccount: false
};

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, options?: LoginOptions) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
  updateExpertProfile: (data: any) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  
  // Expert-specific functions
  registerExpert?: (email: string, password: string, expertData: any) => Promise<boolean>;
  refreshUserProfile?: () => Promise<void>;
  refreshExpertProfile?: () => Promise<void>;
  updateUserProfile?: (data: any) => Promise<boolean>;
  addExpertService?: (serviceId: number) => Promise<boolean>;
  removeExpertService?: (serviceId: number) => Promise<boolean>;
  
  // Extended methods for user interactions
  updateProfilePicture?: (file: File) => Promise<string | null>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
}
