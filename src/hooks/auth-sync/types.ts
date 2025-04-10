
import { UserProfile } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import { ExpertProfile } from '@/types/expert';

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
  sessionType: 'user' | 'expert' | 'dual' | 'none';
  isLoggingOut: boolean;
}
