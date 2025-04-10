
import { useState, useEffect, useCallback } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/features/expert-auth';
import { useAuthCheckEffect } from './useAuthCheckEffect';
import { useAuthLogoutMethods } from './useAuthLogoutMethods';
import { SessionType, UseAuthSynchronizationReturn } from './types';

export const useAuthSynchronization = (): UseAuthSynchronizationReturn => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [isExpertAuthenticated, setIsExpertAuthenticated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentExpert, setCurrentExpert] = useState(null);
  const [sessionType, setSessionType] = useState<SessionType>('none');
  const [hasDualSessions, setHasDualSessions] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const userAuth = useUserAuth();
  const expertAuth = useExpertAuth();
  
  // Sync auth states when either auth state changes
  useEffect(() => {
    setIsUserAuthenticated(userAuth.isAuthenticated);
    setCurrentUser(userAuth.currentUser);
  }, [userAuth.isAuthenticated, userAuth.currentUser]);

  useEffect(() => {
    setIsExpertAuthenticated(!!expertAuth.currentExpert && expertAuth.initialized);
    setCurrentExpert(expertAuth.currentExpert);
  }, [expertAuth.currentExpert, expertAuth.initialized]);

  // Determine overall authentication state
  useEffect(() => {
    setIsAuthenticated(isUserAuthenticated || isExpertAuthenticated);
    setHasDualSessions(isUserAuthenticated && isExpertAuthenticated);
    
    if (isUserAuthenticated && isExpertAuthenticated) {
      setSessionType('dual');
    } else if (isUserAuthenticated) {
      setSessionType('user');
    } else if (isExpertAuthenticated) {
      setSessionType('expert');
    } else {
      setSessionType('none');
    }
  }, [isUserAuthenticated, isExpertAuthenticated]);

  // Track initialization states
  useEffect(() => {
    setIsAuthInitialized(!userAuth.loading);
    setIsAuthLoading(userAuth.loading || expertAuth.loading);
  }, [userAuth.loading, expertAuth.loading]);

  // Complete synchronization
  useEffect(() => {
    if (!isAuthLoading && isAuthInitialized) {
      setIsSynchronizing(false);
      setAuthCheckCompleted(true);
    }
  }, [isAuthLoading, isAuthInitialized]);

  const { syncAuthState } = useAuthCheckEffect({
    isUserAuthenticated,
    isExpertAuthenticated,
    isAuthenticated,
    isAuthInitialized,
    isAuthLoading,
    authCheckCompleted,
    isSynchronizing,
    currentUser,
    currentExpert,
    hasDualSessions,
    sessionType,
    isLoggingOut
  });

  const { 
    userLogout, 
    expertLogout, 
    fullLogout 
  } = useAuthLogoutMethods(
    userAuth.logout, 
    expertAuth.logout, 
    setIsLoggingOut
  );

  return {
    syncAuthState,
    isUserAuthenticated,
    isExpertAuthenticated,
    isAuthenticated,
    isAuthInitialized,
    isAuthLoading,
    authCheckCompleted,
    isSynchronizing,
    currentUser,
    currentExpert,
    userLogout,
    expertLogout,
    fullLogout,
    hasDualSessions,
    sessionType,
    isLoggingOut
  };
};

export * from './types';
