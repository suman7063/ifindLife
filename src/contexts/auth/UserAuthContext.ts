
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/supabase';
import type { UserAuthContextType } from './types';

export const UserAuthContext = createContext<UserAuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  authLoading: false,
  profileNotFound: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
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
