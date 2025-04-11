
import React from 'react';
import { UserProfile } from '@/types/supabase';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';
import { User } from '@supabase/supabase-js';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;
  profileNotFound: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: string | number) => Promise<boolean>;
  removeFromFavorites: (expertId: string | number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: NewReview | { expertId: string | number, rating: number, comment: string }) => Promise<boolean>;
  reportExpert: (report: NewReport | { expertId: string | number, reason: string, details: string }) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string; 
  getReferralLink: () => string | null;
  user: User | null;
  loading: boolean;
  updateProfilePicture: (file: File) => Promise<string | null>;
  isLoggingOut?: boolean;
}

export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
