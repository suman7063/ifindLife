
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type UserRole = 'user' | 'expert' | 'admin' | null;
export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// Initial auth state
export const initialAuthState: AuthState = {
  user: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  session: null,
  error: null,
  profile: null,
  walletBalance: 0,
  sessionType: 'none'
};

// Define a LoginOptions interface for the login function
export interface LoginOptions {
  asExpert?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  session: Session | null;
  error: Error | null;
  profile: UserProfile | null; // For backward compatibility
  walletBalance: number;
  sessionType: SessionType;
}

export interface AuthActions {
  login: (email: string, password: string, options?: LoginOptions) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  registerExpert: (email: string, password: string, expertData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  refreshExpertProfile: () => Promise<ExpertProfile | null>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  addExpertService: (serviceId: number, price: number) => Promise<boolean>;
  removeExpertService: (serviceId: number) => Promise<boolean>;
}

export interface AuthContextType extends AuthState, AuthActions {}
