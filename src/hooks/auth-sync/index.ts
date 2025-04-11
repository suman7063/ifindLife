
import { useState, useEffect, useCallback } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext'; 
import { useExpertAuth } from '@/hooks/expert-auth';
import { useAuthCheckEffect } from './useAuthCheckEffect';
import { useAuthLogoutMethods } from './useAuthLogoutMethods';
import { useAuthStateSync } from './useAuthStateSync';
import { AuthSyncState, UseAuthSynchronizationReturn, SessionType } from './types';

export const useAuthSynchronization = (): UseAuthSynchronizationReturn => {
  const [state, setState] = useState<AuthSyncState>({
    isUserAuthenticated: false,
    isExpertAuthenticated: false,
    isSynchronizing: true,
    isAuthInitialized: false,
    authCheckCompleted: false,
    hasDualSessions: false,
    sessionType: 'none',
    currentUser: null,
    currentExpert: null
  });
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get auth contexts
  const userAuth = useUserAuth();
  const expertAuth = useExpertAuth();
  
  // Setup auth check effect
  useAuthCheckEffect(userAuth, expertAuth, state, setState);
  
  // Setup auth state sync
  const syncAuthState = useAuthStateSync(userAuth, expertAuth, state, setState);
  
  // Setup auth logout methods
  const { userLogout, expertLogout, fullLogout } = useAuthLogoutMethods(
    userAuth, 
    expertAuth, 
    setIsLoggingOut
  );
  
  return {
    ...state,
    isAuthenticated: state.isUserAuthenticated || state.isExpertAuthenticated,
    isAuthLoading: state.isSynchronizing || !state.isAuthInitialized,
    syncAuthState,
    userLogout,
    expertLogout,
    fullLogout,
    isLoggingOut
  };
};
