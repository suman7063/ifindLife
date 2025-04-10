
import { useCallback } from 'react';
import { AuthSyncState, SessionType } from './types';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/expert';

export const useAuthCheckEffect = (authSyncState: AuthSyncState) => {
  const {
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    sessionType
  } = authSyncState;

  // Function to trigger manual sync of auth states
  const syncAuthState = useCallback(async (): Promise<boolean> => {
    try {
      console.log('[AuthSync] Manual sync triggered', {
        isUserAuthenticated,
        isExpertAuthenticated,
        currentUser: currentUser ? 'exists' : 'none',
        currentExpert: currentExpert ? 'exists' : 'none',
        sessionType
      });
      
      return true;
    } catch (error) {
      console.error('[AuthSync] Error during manual sync:', error);
      return false;
    }
  }, [
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    sessionType
  ]);

  return { syncAuthState };
};
