
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/supabase';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  profileNotFound: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert: (expertId: string, reason: string, details: string) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  getExpertShareLink: (expertId: string) => string;
  getReferralLink: () => string | null;
}

export const UserAuthContext = createContext<UserAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  authLoading: false,
  profileNotFound: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  updateProfilePicture: async () => null,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  rechargeWallet: async () => false,
  addReview: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => null
});

export const useUserAuth = () => useContext(UserAuthContext);
