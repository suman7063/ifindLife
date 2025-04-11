
import { useState, useCallback } from 'react';
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useAuthCheckEffect } from './useAuthCheckEffect';
import { useAuthLogoutMethods } from './useAuthLogoutMethods';
import { SessionType, UseAuthSynchronizationReturn } from './types';

export const useAuthSynchronization = (): UseAuthSynchronizationReturn => {
  const [sessionType, setSessionType] = useState<SessionType>('none');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isExpertAuthenticated, setIsExpertAuthenticated] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);

  const userAuth = useContext(UserAuthContext);
  const { currentUser, isAuthenticated, logout } = userAuth;
  const { 
    currentExpert, 
    isAuthenticated: expertIsAuthenticated, 
    logout: expertLogoutFn 
  } = useExpertAuth();

  // Use the auth check effect
  const authState = useAuthCheckEffect(
    currentUser,
    currentExpert,
    isAuthenticated,
    expertIsAuthenticated
  );
  
  // Use auth logout methods
  const { userLogout, expertLogout, fullLogout } = useAuthLogoutMethods(
    sessionType,
    setIsUserAuthenticated,
    setIsExpertAuthenticated,
    setSessionType,
    setHasDualSessions,
    setIsLoggingOut
  );

  const handleSetIsLoggingOut = useCallback((value: boolean) => {
    setIsLoggingOut(value);
  }, []);
  
  return {
    // Combine state from auth check effect
    ...authState,
    // Add user and expert authentication state
    isUserAuthenticated: authState.isUserAuthenticated,
    isExpertAuthenticated: authState.isExpertAuthenticated,
    currentUser,
    currentExpert,
    isAuthenticated: authState.isUserAuthenticated,
    isAuthLoading: authState.isSynchronizing,
    // Logout methods
    userLogout,
    expertLogout,
    fullLogout,
    // Logging out state handler
    isLoggingOut,
    setIsLoggingOut: handleSetIsLoggingOut
  };
};

export * from './types';
