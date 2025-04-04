
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';

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
    logout: userLogout 
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
  }, [isUserAuthenticated, isExpertAuthenticated, userLoading, expertLoading, authInitialized]);
  
  // Prevent both auth types from being active at the same time
  useEffect(() => {
    const handleAccountTypeConflicts = async () => {
      // Wait until both auth systems are initialized
      if (!authState.initializedUser || !authState.initializedExpert) {
        return;
      }
      
      // If user is loading auth state, wait
      if (authState.userLoading || authState.expertLoading) {
        return;
      }
      
      // If both contexts report the user is authenticated, log one out
      if (authState.userAuthenticated && authState.expertAuthenticated) {
        console.warn("Both user and expert authenticated simultaneously, resolving conflict...");
        
        // Prioritize user authentication by logging out of expert
        try {
          await expertLogout();
          console.log("Logged out of expert account to resolve conflict");
        } catch (error) {
          console.error("Error logging out expert during conflict resolution:", error);
        }
      }
    };
    
    handleAccountTypeConflicts();
  }, [authState, expertLogout]);
  
  // Expose the synchronized status of both auth systems
  const logout = async () => {
    if (authState.userAuthenticated) {
      await userLogout();
    }
    if (authState.expertAuthenticated) {
      await expertLogout();
    }
  };
  
  return {
    isUserAuthenticated: authState.userAuthenticated,
    isExpertAuthenticated: authState.expertAuthenticated,
    isAuthInitialized: authState.initializedUser && authState.initializedExpert,
    isAuthLoading: authState.userLoading || authState.expertLoading,
    logout
  };
};
