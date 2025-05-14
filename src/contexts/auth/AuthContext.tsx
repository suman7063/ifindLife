
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthState, initialAuthState, UserRole } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export interface AuthContextType extends AuthState {
  // Auth methods
  login: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  logout: () => Promise<boolean>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  
  // Favorites methods
  addToFavorites?: (expertId: string | number) => Promise<boolean>;
  removeFromFavorites?: (expertId: string | number) => Promise<boolean>;
  
  // Wallet methods
  rechargeWallet?: (amount: number) => Promise<boolean>;
  
  // User review methods
  addReview?: (reviewData: any) => Promise<boolean>;
  
  // Expert reporting methods
  reportExpert?: (reportData: any) => Promise<boolean>;
  
  // Service verification methods
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  
  // Linking methods
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  
  // Refresh methods
  refreshUserData: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: async () => false,
  logout: async () => false,
  signup: async () => false,
  updateProfile: async () => false,
  updateExpertProfile: async () => false,
  updatePassword: async () => false,
  refreshUserData: async () => {}
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the hooks to manage state and functions
  const { authState, setAuthState, fetchUserData } = useAuthState();
  const { 
    login, 
    logout, 
    signup, 
    updateProfile, 
    updateExpertProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  } = useAuthFunctions(authState, setAuthState);
  
  // Method to refresh user data
  const refreshUserData = async () => {
    if (authState.user) {
      await fetchUserData(authState.user.id);
    }
  };
  
  // Combine state and functions into context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    signup,
    updateProfile,
    updateExpertProfile, 
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,
    refreshUserData
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
