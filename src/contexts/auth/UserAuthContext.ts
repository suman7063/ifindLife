
import React from 'react';
import { UserProfile } from '../types/supabase';
import { Review, Report } from '../types/supabase';

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
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: Review) => Promise<boolean>;
  reportExpert: (report: Report) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string; // Accept both string and number
  getReferralLink: () => string | null;
  user: any;
  loading: boolean;
  updateProfilePicture: (file: File) => Promise<string | null>;
}

export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
