
import { AuthSyncState } from '@/features/auth-sync/types';
import { UserAuthContextType } from '@/contexts/auth/UserAuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';

type ExpertAuthHook = ReturnType<typeof useExpertAuth>;

export const useAuthStateSync = (
  userAuth: UserAuthContextType,
  expertAuth: ExpertAuthHook,
  state: AuthSyncState,
  setState: React.Dispatch<React.SetStateAction<AuthSyncState>>
) => {
  const syncAuthState = async () => {
    try {
      // Refresh user profile if authenticated and refreshProfile exists
      if (userAuth.isAuthenticated && typeof userAuth.refreshProfile === 'function') {
        await userAuth.refreshProfile();
      }
      
      // Refresh expert profile if authenticated and has refreshProfile method
      if (expertAuth.isAuthenticated && typeof expertAuth.refreshProfile === 'function') {
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
  
  return syncAuthState;
};

// Helper function to determine session type
const determineSessionType = (isUserAuth: boolean, isExpertAuth: boolean) => {
  if (isUserAuth && isExpertAuth) return 'dual';
  if (isUserAuth) return 'user';
  if (isExpertAuth) return 'expert';
  return 'none';
};
