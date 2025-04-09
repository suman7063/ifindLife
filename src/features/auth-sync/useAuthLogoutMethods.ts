
import { useContext, useCallback } from 'react';
import { UserAuthContext } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/features/expert-auth';
import { SessionType } from './types';

export const useAuthLogoutMethods = (
  sessionType: SessionType,
  setIsUserAuthenticated: (value: boolean) => void,
  setIsExpertAuthenticated: (value: boolean) => void,
  setSessionType: (value: SessionType) => void,
  setHasDualSessions: (value: boolean) => void,
  setIsLoggingOut: (value: boolean) => void
) => {
  const { logout: userLogoutFn } = useContext(UserAuthContext);
  const { logout: expertLogoutFn } = useExpertAuth();
  
  const userLogout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      console.log("Auth Sync: Performing user logout");
      
      const success = await userLogoutFn();
      
      if (success) {
        setIsUserAuthenticated(false);
        
        if (sessionType === 'dual') {
          setSessionType('expert');
        } else {
          setSessionType('none');
        }
        
        setHasDualSessions(false);
        return true;
      }
      
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [userLogoutFn, sessionType, setIsUserAuthenticated, setSessionType, setHasDualSessions, setIsLoggingOut]);

  const expertLogout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      console.log("Auth Sync: Performing expert logout");
      
      const success = await expertLogoutFn();
      
      if (success) {
        setIsExpertAuthenticated(false);
        
        if (sessionType === 'dual') {
          setSessionType('user');
        } else {
          setSessionType('none');
        }
        
        setHasDualSessions(false);
        return true;
      }
      
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [expertLogoutFn, sessionType, setIsExpertAuthenticated, setSessionType, setHasDualSessions, setIsLoggingOut]);

  const fullLogout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      console.log("Auth Sync: Performing full logout");
      
      // Order matters: First expert, then user
      let expertSuccess = true;
      let userSuccess = true;
      
      if (sessionType === 'expert' || sessionType === 'dual') {
        expertSuccess = await expertLogoutFn();
        if (!expertSuccess) {
          console.error("Auth Sync: Expert logout failed during full logout");
        }
      }
      
      if (sessionType === 'user' || sessionType === 'dual') {
        userSuccess = await userLogoutFn();
        if (!userSuccess) {
          console.error("Auth Sync: User logout failed during full logout");
        }
      }
      
      if (expertSuccess && userSuccess) {
        setIsUserAuthenticated(false);
        setIsExpertAuthenticated(false);
        setSessionType('none');
        setHasDualSessions(false);
        return true;
      }
      
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [
    sessionType,
    expertLogoutFn,
    userLogoutFn,
    setIsUserAuthenticated,
    setIsExpertAuthenticated,
    setSessionType,
    setHasDualSessions,
    setIsLoggingOut
  ]);

  return {
    userLogout,
    expertLogout,
    fullLogout
  };
};

export default useAuthLogoutMethods;
