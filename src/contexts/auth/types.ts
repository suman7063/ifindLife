
import { AuthUser, UserRole } from './AuthContext';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';

export { AuthUser, UserRole };

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
