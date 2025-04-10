
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth'; 
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { AuthSyncState, SessionType, UseAuthSynchronizationReturn } from '@/hooks/auth-sync/types';

const initialState: AuthSyncState = {
  isUserAuthenticated: false,
  isExpertAuthenticated: false,
  isAuthenticated: false,
  isAuthInitialized: false,
  isAuthLoading: true,
  authCheckCompleted: false,
  isSynchronizing: true,
  currentUser: null,
  currentExpert: null,
  hasDualSessions: false,
  sessionType: 'none',
  isLoggingOut: false
};

export const useAuthSynchronization = (): UseAuthSynchronizationReturn => {
  const [authState, setAuthState] = useState<AuthSyncState>(initialState);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userAuth = useUserAuth();
  const expertAuth = useExpertAuth();
  
  // Sync authentication states between user and expert
  const syncAuthState = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isSynchronizing: true }));
      
      const isUserAuth = userAuth.isAuthenticated;
      const isExpertAuth = expertAuth.isAuthenticated;
      
      const sessionType: SessionType = 
        isUserAuth && isExpertAuth ? 'dual' :
        isUserAuth ? 'user' :
        isExpertAuth ? 'expert' : 'none';
        
      setAuthState({
        isUserAuthenticated: isUserAuth,
        isExpertAuthenticated: isExpertAuth,
        isAuthenticated: isUserAuth || isExpertAuth,
        isAuthInitialized: true,
        isAuthLoading: userAuth.loading || userAuth.authLoading,
        authCheckCompleted: true,
        isSynchronizing: false,
        currentUser: userAuth.currentUser,
        currentExpert: expertAuth.currentExpert,
        hasDualSessions: isUserAuth && isExpertAuth,
        sessionType,
        isLoggingOut
      });
      
      return true;
    } catch (error) {
      console.error('Error synchronizing auth states:', error);
      setAuthState(prev => ({ ...prev, isSynchronizing: false }));
      return false;
    }
  };
  
  // Initialize auth synchronization
  useEffect(() => {
    syncAuthState();
  }, [userAuth.isAuthenticated, expertAuth.isAuthenticated]);
  
  // Logout handlers
  const userLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      await userAuth.logout();
      await syncAuthState();
      return true;
    } catch (error) {
      console.error('User logout error:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const expertLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      await expertAuth.logout();
      await syncAuthState();
      return true;
    } catch (error) {
      console.error('Expert logout error:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const fullLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      await userAuth.logout();
      await expertAuth.logout();
      await syncAuthState();
      return true;
    } catch (error) {
      console.error('Full logout error:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return {
    ...authState,
    syncAuthState,
    userLogout,
    expertLogout,
    fullLogout,
    isLoggingOut
  };
};
