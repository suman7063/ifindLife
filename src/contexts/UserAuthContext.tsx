
// This file is maintained for backward compatibility
// It re-exports everything from the refactored structure
import { UserAuthProvider, UserAuthContext, useUserAuth } from './auth';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/supabase';

// Define a local type for backward compatibility
export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;  // Add this for consistency
  loading: boolean;
  profileNotFound: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  getExpertShareLink?: (expertId: number) => string;
  hasTakenServiceFrom?: (expertId: number) => boolean;
  getReferralLink?: () => string;
  refreshProfile?: () => Promise<void>;
  user: User | null;
}

// Re-export other needed types
export { UserAuthProvider, UserAuthContext, useUserAuth };
export type { User, UserProfile };
