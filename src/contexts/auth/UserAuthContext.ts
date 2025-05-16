
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean; // Required property for backward compatibility
  loading: boolean;
  profileNotFound: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: NewReview) => Promise<boolean>;
  reportExpert: (report: NewReport) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string; 
  getReferralLink: () => string | null;
  user: any;
  updateProfilePicture: (file: File) => Promise<string | null>;
}

// Create the context with a default empty object that will be populated by the provider
export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
