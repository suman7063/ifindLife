
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * This hook provides backward compatibility with the old authentication hooks.
 * It maps the unified authentication context to the interfaces expected by legacy components.
 * 
 * This should be used as a temporary solution during migration.
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Mark as initialized once we've completed the first auth check
  useEffect(() => {
    if (!auth.isLoading) {
      setIsInitialized(true);
    }
  }, [auth.isLoading]);

  // Legacy useUserAuth compatibility layer
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    loading: auth.isLoading,
    authLoading: auth.isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    user: auth.user,
    profileNotFound: false,  // This was used for error handling in the old system
  };

  // Legacy useExpertAuth compatibility layer
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    isLoading: auth.isLoading,
    authInitialized: isInitialized,
    login: auth.expertLogin,
    logout: auth.logout,
    updateProfile: auth.updateExpertProfile,
  };

  // Legacy auth synchronization layer
  const authSync = {
    isUserAuthenticated: auth.isAuthenticated && auth.role === 'user',
    isExpertAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    isSynchronizing: auth.isLoading,
    isAuthInitialized: isInitialized,
    authCheckCompleted: !auth.isLoading,
    hasDualSessions: false,  // This concept is eliminated in the new system
    sessionType: auth.role || 'none',
    isLoggingOut: false,
    userLogout: auth.logout,
    expertLogout: auth.logout,
    fullLogout: auth.logout,
    setIsLoggingOut: () => {},  // No-op, managed internally now
    isAuthenticated: auth.isAuthenticated,
    currentUser: auth.userProfile,
    currentExpert: auth.expertProfile,
    isAuthLoading: auth.isLoading,
  };

  return {
    userAuth,
    expertAuth,
    authSync,
  };
};
