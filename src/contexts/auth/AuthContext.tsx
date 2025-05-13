
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile, UserRole, AuthStatus } from './types';

// Define the AuthContextType interface
export interface AuthContextType {
  // Auth state
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for backward compatibility
  role: UserRole;
  expertProfile: ExpertProfile | null;
  walletBalance: number;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  
  // Auth methods
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  loginWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, userData?: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>; // Alias for backward compatibility
  updatePassword: (password: string) => Promise<boolean>;
  updateEmail: (email: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<{ error: Error | null }>;
  
  // Profile methods
  getUserDisplayName: () => string;
  fetchProfile: () => Promise<UserProfile | null>;
  addFunds: (amount: number) => Promise<{ error: Error | null }>;
  updateWalletBalance: (newBalance: number) => Promise<{ error: Error | null }>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  
  // Expert methods
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<{ error: Error | null }>;
  fetchExpertProfile: () => Promise<ExpertProfile | null>;
  registerAsExpert: (data: any) => Promise<{ error: Error | null }>;
  
  // User actions
  addReview: (review: any) => Promise<boolean>;
  reportExpert: (report: any) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;
  
  // Favorites
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
}

// Create the context with an empty default value
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Create a hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Add debugging to trace the issue
  console.log('Auth context login function available:', !!context.login);
  
  return context;
};

// Re-export the provider from the provider file
export { AuthProvider } from './provider/AuthContextProvider';
