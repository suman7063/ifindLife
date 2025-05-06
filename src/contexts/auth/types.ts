
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/supabase';
import { Review, Report, NewReview, NewReport } from '@/types/supabase/tables';

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
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  
  // Role checking
  checkUserRole: () => Promise<UserRole>;
  
  // Expert interactions
  addToFavorites?: (expertId: number) => Promise<boolean>;
  removeFromFavorites?: (expertId: number) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  
  // Review and report functions
  addReview?: {
    (expertId: string, rating: number, comment: string): Promise<boolean>;
    (review: NewReview): Promise<boolean>;
  };
  
  reportExpert?: {
    (expertId: string, reason: string, details: string): Promise<boolean>;
    (report: NewReport): Promise<boolean>;  
  };
                 
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  getExpertShareLink?: (expertId: string | number) => string;
  getReferralLink?: () => string | null;
  
  // Session type
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  
  // Backward compatibility properties
  currentUser: UserProfile | null;
  currentExpert: ExpertProfile | null;
  authLoading: boolean;
}
