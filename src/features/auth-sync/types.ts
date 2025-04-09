import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/features/expert-auth';

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

export type UseAuthSynchronizationReturn = AuthSyncState & 
  AuthSyncMethods & {
    isAuthenticated: boolean;
    currentUser: UserProfile | null;
    currentExpert: ExpertProfile | null;
    isAuthLoading: boolean;
  };
