
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole, ExpertProfile } from './types';
import { AuthProvider as AuthContextProvider } from './provider/AuthContextProvider';

// Define a comprehensive auth context type
export interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  profile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  
  // Auth methods
  login: (email: string, password: string, roleOverride?: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  
  // Profile methods
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  fetchProfile?: () => Promise<UserProfile | null>;
  
  // User actions
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  getExpertShareLink?: (expertId: number) => string;
  hasTakenServiceFrom?: (expertId: number) => Promise<boolean>;
  getReferralLink?: () => string | null;
  
  // Additional fields
  walletBalance?: number;
  sessionType?: string;
  authStatus?: string;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  role: null,
  profile: null,
  expertProfile: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => false,
  updateProfile: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export the AuthProvider
export { AuthContextProvider as AuthProvider, AuthContext };
