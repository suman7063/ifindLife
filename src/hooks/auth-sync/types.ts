
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/expert';

export type SessionType = 'user' | 'expert' | 'dual' | 'none';

export interface AuthSyncState {
  isUserAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isAuthLoading: boolean;
  authCheckCompleted: boolean;
  isSynchronizing: boolean;
  currentUser: UserProfile | null;
  currentExpert: ExpertProfile | null;
  hasDualSessions: boolean;
  sessionType: SessionType;
  isLoggingOut: boolean;
}

export interface UseAuthSynchronizationReturn {
  syncAuthState: () => Promise<boolean>;
  isUserAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isAuthLoading: boolean;
  authCheckCompleted: boolean;
  isSynchronizing: boolean;
  currentUser: UserProfile | null;
  currentExpert: ExpertProfile | null;
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  fullLogout: () => Promise<boolean>;
  hasDualSessions: boolean;
  sessionType: SessionType;
  isLoggingOut: boolean;
}
