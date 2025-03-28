
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/supabase';
import type { UserAuthContextType } from './types';

// Ensure the context provides all necessary properties and functions for profile management
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
  updateProfilePicture: async (file: File) => {
    console.error("Default updateProfilePicture implementation called");
    return null;
  },
  updatePassword: async () => false,
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
