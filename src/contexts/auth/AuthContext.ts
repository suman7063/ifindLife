import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

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
  walletBalance: 0
});

export const useAuth = () => {
  // This is just a placeholder. The real hook will be imported separately
  return {} as AuthContextType;
};
