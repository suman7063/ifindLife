
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';

export type SessionType = 'user' | 'expert' | 'dual' | 'none';

export interface AuthSyncState {
  isUserAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  isSynchronizing: boolean;
  isAuthInitialized: boolean;
  authCheckCompleted: boolean;
  hasDualSessions: boolean;
  sessionType: SessionType;
}

export interface AuthSyncMethods {
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  fullLogout: () => Promise<boolean>;
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
  sessionType: 'user' | 'expert' | 'none' | 'dual';
  isLoggingOut: boolean;
}
