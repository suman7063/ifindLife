
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { UserProfile } from '@/types/supabase';

interface AuthState {
  userAuthenticated: boolean;
  expertAuthenticated: boolean;
  initializedUser: boolean;
  initializedExpert: boolean;
  userLoading: boolean;
  expertLoading: boolean;
}

/**
 * Hook to synchronize authentication status across user and expert contexts
 */
export const useAuthSynchronization = () => {
  // Get auth states from both contexts
  const { 
    isAuthenticated: isUserAuthenticated, 
    loading: userLoading,
    logout: userLogout,
    currentUser
  } = useUserAuth();
  
  const { 
    expert, 
    loading: expertLoading,
    authInitialized,
    logout: expertLogout
  } = useExpertAuth();
  
  const isExpertAuthenticated = !!expert;
  
  // Local state
  const [authState, setAuthState] = useState<AuthState>({
    userAuthenticated: false,
    expertAuthenticated: false,
    initializedUser: false,
    initializedExpert: false,
    userLoading: true,
    expertLoading: true
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionType, setSessionType] = useState<'user' | 'expert' | 'dual' | null>(null);
  const [isSynchronizing, setIsSynchronizing] = useState(true);

  // Track the initialization of both auth systems
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      userAuthenticated: isUserAuthenticated,
      expertAuthenticated: isExpertAuthenticated,
      userLoading,
      expertLoading,
      initializedUser: !userLoading,
      initializedExpert: authInitialized
    }));
    
    // Determine session type
    if (isUserAuthenticated && isExpertAuthenticated) {
      setSessionType('dual');
    } else if (isUserAuthenticated) {
      setSessionType('user');
    } else if (isExpertAuthenticated) {
      setSessionType('expert');
    } else {
      setSessionType(null);
    }
    
    setIsSynchronizing(false);
  }, [isUserAuthenticated, isExpertAuthenticated, userLoading, expertLoading, authInitialized]);
  
  // Full logout function
  const fullLogout = async (): Promise<boolean> => {
    if (isLoggingOut) return false;
    
    try {
      setIsLoggingOut(true);
      let userSuccess = true;
      let expertSuccess = true;
      
      if (isUserAuthenticated) {
        userSuccess = await userLogout();
      }
      
      if (isExpertAuthenticated) {
        expertSuccess = await expertLogout();
      }
      
      return userSuccess && expertSuccess;
    } catch (error) {
      console.error("Error during full logout:", error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Expose the synchronized status of both auth systems
  return {
    isAuthenticated: isUserAuthenticated || isExpertAuthenticated,
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    expertProfile: expert,
    isAuthInitialized: authState.initializedUser && authState.initializedExpert,
    isAuthLoading: authState.userLoading || authState.expertLoading,
    userAuthLoading: userLoading,
    userLogout,
    expertLogout,
    logout: fullLogout,
    fullLogout,
    hasDualSessions: isUserAuthenticated && isExpertAuthenticated,
    isSynchronizing,
    sessionType,
    isLoggingOut,
    setIsLoggingOut,
    authCheckCompleted: !userLoading && !expertLoading && authInitialized
  };
};
