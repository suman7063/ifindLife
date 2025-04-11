
// Backward compatibility layer for existing components
import { useState, useEffect, useCallback } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext'; 
import { useExpertAuth } from '@/hooks/expert-auth';
import { AuthSyncState, UseAuthSynchronizationReturn, SessionType } from '@/features/auth-sync/types';

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
  useEffect(() => {
    const checkAuth = async () => {
      setState(prev => ({
        ...prev,
        isUserAuthenticated: userAuth.isAuthenticated,
        isExpertAuthenticated: expertAuth.isAuthenticated,
        currentUser: userAuth.currentUser,
        currentExpert: expertAuth.currentExpert,
        isAuthInitialized: true
      }));
    };
    
    checkAuth();
  }, [userAuth, expertAuth]);
  
  // Setup auth state sync
  const syncAuthState = async () => {
    try {
      // Refresh user profile if authenticated and has refreshProfile method
      if (userAuth.isAuthenticated && typeof userAuth.refreshProfile === 'function') {
        await userAuth.refreshProfile();
      }
      
      // Handle expertAuth.refreshProfile if it exists
      if (expertAuth.isAuthenticated && expertAuth.refreshProfile) {
        await expertAuth.refreshProfile();
      }
      
      // Update state
      setState(prev => ({
        ...prev,
        isUserAuthenticated: userAuth.isAuthenticated,
        isExpertAuthenticated: expertAuth.isAuthenticated,
        currentUser: userAuth.currentUser,
        currentExpert: expertAuth.currentExpert,
        isSynchronizing: false,
        isAuthInitialized: true,
        authCheckCompleted: true,
        hasDualSessions: userAuth.isAuthenticated && expertAuth.isAuthenticated,
        sessionType: determineSessionType(userAuth.isAuthenticated, expertAuth.isAuthenticated)
      }));
      
      return true;
    } catch (error) {
      console.error('Error during auth sync:', error);
      return false;
    }
  };
  
  // Setup auth logout methods
  const userLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await userAuth.logout();
      setIsLoggingOut(false);
      return result;
    } catch (error) {
      setIsLoggingOut(false);
      return false;
    }
  };
  
  const expertLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await expertAuth.logout();
      setIsLoggingOut(false);
      return result;
    } catch (error) {
      setIsLoggingOut(false);
      return false;
    }
  };
  
  const fullLogout = async () => {
    try {
      setIsLoggingOut(true);
      await userAuth.logout();
      await expertAuth.logout();
      setIsLoggingOut(false);
      return true;
    } catch (error) {
      setIsLoggingOut(false);
      return false;
    }
  };
  
  return {
    ...state,
    isAuthenticated: state.isUserAuthenticated || state.isExpertAuthenticated,
    isAuthLoading: state.isSynchronizing || !state.isAuthInitialized,
    syncAuthState,
    userLogout,
    expertLogout,
    fullLogout,
    isLoggingOut,
    currentUser: state.currentUser || null,
    currentExpert: state.currentExpert || null
  };
};

// Helper function to determine session type
const determineSessionType = (isUserAuth: boolean, isExpertAuth: boolean): SessionType => {
  if (isUserAuth && isExpertAuth) return 'dual';
  if (isUserAuth) return 'user';
  if (isExpertAuth) return 'expert';
  return 'none';
};
