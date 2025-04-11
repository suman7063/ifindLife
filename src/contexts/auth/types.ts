
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthFunctions {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  expertLogin: (email: string, password: string) => Promise<boolean>;
  expertSignup: (registrationData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkUserRole: () => Promise<UserRole>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  addReview?: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  reportExpert?: (expertId: string, reason: string, details: string) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string) => string;
  getReferralLink?: () => string | null;
}

export interface AuthContextType extends AuthState, AuthFunctions {
  // Add back compatibility properties
  currentUser?: UserProfile | null;
  currentExpert?: ExpertProfile | null;
  sessionType?: 'none' | 'user' | 'expert' | 'dual';
}

export const initialAuthState: AuthState = {
  session: null,
  user: null,
  userProfile: null,
  expertProfile: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
};
