
import { createContext, useContext } from 'react';
import { AuthContextType, initialAuthState } from './types';

// Create the initial context
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: async () => false,
  loginWithOtp: async () => ({ error: new Error('Not implemented') }),
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
  updateWalletBalance: async () => false,
  rechargeWallet: async () => false,
  updateExpertProfile: async () => ({ error: null }),
  fetchExpertProfile: async () => null,
  registerAsExpert: async () => ({ error: null }),
  addReview: async () => false,
  reportExpert: async () => false,
  hasTakenServiceFrom: async () => false,
  getExpertShareLink: () => '',
  getReferralLink: () => '',
  addToFavorites: async () => false,
  removeFromFavorites: async () => false
});

// Use hook to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Debug output (can be removed in production)
  console.log('Auth context login available:', !!context.login);
  
  return context;
};
