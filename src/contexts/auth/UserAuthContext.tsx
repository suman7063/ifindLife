
import React from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { AuthState } from './types';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  loading: boolean; // Alias for authLoading
  profileNotFound: boolean;
  user?: User | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Profile methods
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  refreshProfile?: () => Promise<void>;
  
  // Expert interaction methods
  addToFavorites?: (expertId: string) => Promise<boolean>;
  removeFromFavorites?: (expertId: string) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: { expertId: string | number, rating: number, comment: string }) => Promise<boolean>;
  reportExpert?: (report: { expertId: string | number, reason: string, details: string }) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
}

// Create and export the context
export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
