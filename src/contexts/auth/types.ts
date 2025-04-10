
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { UserSettings } from '@/types/user';
import { ReferralInfo } from '@/types/supabase/referral';

export type UserRole = 'admin' | 'user' | 'expert' | null;

export interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  profileLoading: boolean;
  authError: string | null;
  profileError: string | null;
  role: UserRole;
  isExpertUser: boolean;
  expertId: string | null;
  favoritesCount: number;
  referrals: ReferralInfo[];
  userSettings: UserSettings | null;
  walletBalance: number;
  authLoading?: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  userProfile: null,
  expertProfile: null,
  isAuthenticated: false,
  isLoading: true,
  hasProfile: false,
  profileLoading: false,
  authError: null,
  profileError: null,
  role: null,
  isExpertUser: false,
  expertId: null,
  favoritesCount: 0,
  referrals: [],
  userSettings: null,
  walletBalance: 0
};
