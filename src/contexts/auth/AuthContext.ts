
import { createContext, useContext } from 'react';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthContextType {
  user: User | null;
  session: any | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for backward compatibility
  expertProfile: ExpertProfile | null; 
  loading: boolean;
  isLoading: boolean; // Alias for backward compatibility
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
  
  // Authentication methods
  signIn: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signUp: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  
  // Aliases for backward compatibility
  login: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signup: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  updatePassword?: (password: string) => Promise<boolean>;
  
  // Favorites management
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  
  // Wallet management
  rechargeWallet?: (amount: number) => Promise<boolean>;
  
  // Review and reporting
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  
  // Utility methods
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  
  // Session management
  clearSession: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
