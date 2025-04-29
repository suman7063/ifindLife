
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/supabase';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: UserRole;
}

export const initialAuthState: AuthState = {
  session: null,
  user: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  role: null
};

export interface AuthContextType extends AuthState {
  // Auth functions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: Partial<UserProfile>, referralCode?: string) => Promise<boolean>;
  expertLogin: (email: string, password: string) => Promise<boolean>;
  expertSignup: (registrationData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Profile functions
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  
  // Role checking
  checkUserRole: () => Promise<UserRole>;
  
  // Expert interactions
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  addReview?: (review: any) => Promise<boolean>;
  reportExpert?: (report: any) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string; 
  getReferralLink?: () => string | null;
  
  // Backward compatibility properties
  currentUser: UserProfile | null;
  currentExpert: ExpertProfile | null;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  authLoading: boolean; // Add this for backward compatibility
}
