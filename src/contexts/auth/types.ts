
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type UserRole = 'user' | 'expert' | 'admin' | null;

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  authStatus: AuthStatus;
  userProfile: UserProfile | null;
  profile: UserProfile | null; // Alias for backward compatibility
  expertProfile: ExpertProfile | null;
  role: UserRole;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
}

export const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  session: null,
  authStatus: 'loading',
  userProfile: null,
  profile: null,
  expertProfile: null,
  role: null,
  sessionType: 'none',
  walletBalance: 0,
};
