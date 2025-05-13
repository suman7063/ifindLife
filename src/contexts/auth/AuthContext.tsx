
import React, { createContext, useContext } from 'react';
import { AuthContextProvider } from './provider/AuthContextProvider';
import { AuthContextType, initialAuthState } from './types';

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  // Add required methods with no-op implementations
  login: async () => false,
  loginWithOtp: async () => ({ error: null }),
  signup: async () => false,
  logout: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => false,
  updateUserProfile: async () => false,
  updatePassword: async () => false,
  updateEmail: async () => ({ error: null }),
  refreshSession: async () => ({ error: null }),
  getUserDisplayName: () => '',
  fetchProfile: async () => null,
  addFunds: async () => ({ error: null }),
  updateWalletBalance: async () => ({ error: null }),
  rechargeWallet: async () => false,
  updateExpertProfile: async () => ({ error: null }),
  fetchExpertProfile: async () => null,
  registerAsExpert: async () => ({ error: null }),
  addReview: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => null,
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  updateProfilePicture: async () => null
});

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Forward the AuthProvider from the provider file
export const AuthProvider = AuthContextProvider;
