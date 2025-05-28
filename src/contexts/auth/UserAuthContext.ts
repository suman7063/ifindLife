
import React from 'react';
import { UserProfile } from '@/types/supabase/user';

export interface UserAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  authLoading: boolean;
  loading: boolean;
  profileNotFound: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: any) => Promise<boolean>;
  reportExpert: (report: any) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string; 
  getReferralLink: () => string | null;
  user: any;
  updateProfilePicture: (file: File) => Promise<string | null>;
}

// Create default implementations to prevent errors
const defaultAuthContext: UserAuthContextType = {
  currentUser: null,
  isAuthenticated: false,
  login: async () => {
    console.error('UserAuthContext: login function not implemented');
    return false;
  },
  signup: async () => {
    console.error('UserAuthContext: signup function not implemented');
    return false;
  },
  logout: async () => {
    console.error('UserAuthContext: logout function not implemented');
    return false;
  },
  authLoading: false,
  loading: false,
  profileNotFound: false,
  updateProfile: async () => {
    console.error('UserAuthContext: updateProfile function not implemented');
    return false;
  },
  updatePassword: async () => {
    console.error('UserAuthContext: updatePassword function not implemented');
    return false;
  },
  addToFavorites: async () => {
    console.error('UserAuthContext: addToFavorites function not implemented');
    return false;
  },
  removeFromFavorites: async () => {
    console.error('UserAuthContext: removeFromFavorites function not implemented');
    return false;
  },
  rechargeWallet: async () => {
    console.error('UserAuthContext: rechargeWallet function not implemented');
    return false;
  },
  addReview: async () => {
    console.error('UserAuthContext: addReview function not implemented');
    return false;
  },
  reportExpert: async () => {
    console.error('UserAuthContext: reportExpert function not implemented');
    return false;
  },
  hasTakenServiceFrom: async () => {
    console.error('UserAuthContext: hasTakenServiceFrom function not implemented');
    return false;
  },
  getExpertShareLink: () => {
    console.error('UserAuthContext: getExpertShareLink function not implemented');
    return '';
  },
  getReferralLink: () => {
    console.error('UserAuthContext: getReferralLink function not implemented');
    return null;
  },
  user: null,
  updateProfilePicture: async () => {
    console.error('UserAuthContext: updateProfilePicture function not implemented');
    return null;
  }
};

// Create the context with default implementations
export const UserAuthContext = React.createContext<UserAuthContextType>(defaultAuthContext);
