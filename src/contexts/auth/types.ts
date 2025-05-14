
// Import the UserProfile from the supabase/user module
import { UserProfile } from '@/types/supabase/user';
export type { UserProfile };

export type UserRole = 'user' | 'expert' | 'admin';

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole | null;
  profile?: UserProfile | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for backward compatibility
  expertProfile: any | null; // Using any for now, should be updated to use ExpertProfile
  loading: boolean;
  isLoading: boolean; // Alias for backward compatibility
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  walletBalance: number;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearSession: () => void;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null;
  expertProfile: any | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  role: UserRole | null;
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
