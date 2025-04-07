
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/hooks/expert-auth';

export type SessionType = 'user' | 'expert' | 'dual' | 'none';

export interface AuthSyncState {
  isUserAuthenticated: boolean;
  isExpertAuthenticated: boolean;
  isSynchronizing: boolean;
  isAuthInitialized: boolean;
  authCheckCompleted: boolean;
  hasDualSessions: boolean;
  sessionType: SessionType;
  isLoggingOut: boolean;
}

export interface AuthSyncMethods {
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  fullLogout: () => Promise<boolean>;
  setIsLoggingOut: (value: boolean) => void;
}

export type UseAuthSynchronizationReturn = AuthSyncState & 
  AuthSyncMethods & {
    isAuthenticated: boolean;
    currentUser: UserProfile | null;
    currentExpert: ExpertProfile | null;
    isAuthLoading: boolean;
  };
