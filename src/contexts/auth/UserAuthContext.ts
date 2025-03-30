
import { createContext, useContext } from 'react';
import { UserProfile } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLoading: boolean;
  profileNotFound?: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string) => string;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getReferralLink?: () => string;
  fetchUserProfile?: (userId: string) => Promise<UserProfile | null>;
}

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  
  return context;
};
