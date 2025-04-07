
// This file is maintained for backward compatibility
// New components should use the unified AuthContext directly

import { createContext } from 'react';
import { UserProfile } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

// Define the shape of the user auth context
export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;
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
  user: User | null;
  loading: boolean;
}

// Default context value
const defaultContextValue: UserAuthContextType = {
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  authLoading: true,
  profileNotFound: false,
  updateProfile: async () => false,
  updatePassword: async () => false,
  user: null,
  loading: true,
};

// Create the context
export const UserAuthContext = createContext<UserAuthContextType>(defaultContextValue);

// Re-export the hook for simplicity
export { useUserAuth } from '@/hooks/useUserAuth';
