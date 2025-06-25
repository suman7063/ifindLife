import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateProfile: async () => false,
  updateExpertProfile: async () => false,
  updatePassword: async () => false,
  refreshProfile: async () => {},
  session: null,
  error: null,
  walletBalance: 0,
  profile: null,
  sessionType: 'none',
  hasUserAccount: false
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
