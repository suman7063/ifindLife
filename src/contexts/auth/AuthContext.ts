
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthContextType {
  user: User | null;
  session: any | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
  
  login: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signup: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  signIn: (email: string, password: string, loginAs?: 'user' | 'expert') => Promise<boolean>;
  signUp: (email: string, password: string, userData?: any, referralCode?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture?: (file: File) => Promise<string | null>;
  updatePassword: (password: string) => Promise<boolean>;  // Added this missing method
  
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
