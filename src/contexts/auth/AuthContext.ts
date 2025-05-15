
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { NewReview, NewReport } from '@/types/supabase/tables';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  session: Session | null;
  error: Error | null;
  walletBalance: number;
  profile: UserProfile | null; // For backward compatibility
  
  // Extended methods for user interactions
  updateProfilePicture?: (file: File) => Promise<string | null>;
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: NewReview | any) => Promise<boolean>;
  reportExpert?: (report: NewReport | any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string | number) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
}

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
  updatePassword: async () => false,
  refreshProfile: async () => {},
  session: null,
  error: null,
  walletBalance: 0,
  profile: null
});

export const useAuth = () => {
  // This is just a placeholder. The real hook will be imported separately
  return {} as AuthContextType;
};
