
import { UserRole } from './AuthContext';
import { UserProfile } from '@/types/database/unified';
import { ExpertProfile } from '@/types/database/unified';
import { Session, User } from '@supabase/supabase-js';

export type { UserRole };

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  session: Session | null;
  error: Error | null;
  walletBalance: number;
}

export interface AuthState {
  user: AuthUser | null;
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
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  profile: null,
  userProfile: null,
  expertProfile: null,
  loading: true,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  role: null,
  sessionType: 'none',
  walletBalance: 0
};
