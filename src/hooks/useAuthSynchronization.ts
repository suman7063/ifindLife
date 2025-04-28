
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { useUnifiedAuth } from './auth/useUnifiedAuth';

export const useAuthSynchronization = () => {
  const context = useContext(AuthContext);
  const unifiedAuth = useUnifiedAuth();
  
  if (context === undefined) {
    // Provide fallback values instead of throwing to prevent crashes
    console.warn("useAuthSynchronization used outside of AuthProvider - using fallback values");
    return {
      isAuthenticated: false,
      isExpertAuthenticated: false,
      isUserAuthenticated: false,
      currentUser: null,
      currentExpert: null,
      userLogout: unifiedAuth.userLogout,
      expertLogout: unifiedAuth.expertLogout,
      fullLogout: unifiedAuth.fullLogout,
      hasDualSessions: false,
      isSynchronizing: false,
      authCheckCompleted: true,
      isAuthInitialized: true,
      isAuthLoading: false,
      sessionType: 'none',
      isLoggingOut: unifiedAuth.isLoggingOut,
      setIsLoggingOut: unifiedAuth.setIsLoggingOut
    };
  }
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log('Auth synchronization - Current state:', {
      isAuthenticated: context.isAuthenticated,
      role: context.role,
      hasUserProfile: !!context.userProfile,
      hasExpertProfile: !!context.expertProfile
    });
  }, [context.isAuthenticated, context.role, context.userProfile, context.expertProfile]);
  
  return {
    isAuthenticated: context.isAuthenticated,
    isExpertAuthenticated: context.role === 'expert' && context.isAuthenticated,
    isUserAuthenticated: context.role === 'user' && context.isAuthenticated,
    currentUser: context.userProfile,
    currentExpert: context.expertProfile,
    userLogout: unifiedAuth.userLogout,
    expertLogout: unifiedAuth.expertLogout,
    fullLogout: unifiedAuth.fullLogout,
    hasDualSessions: false,
    isSynchronizing: context.isLoading,
    authCheckCompleted: !context.isLoading,
    isAuthInitialized: !context.isLoading,
    isAuthLoading: context.isLoading,
    sessionType: context.sessionType || 'none',
    isLoggingOut: unifiedAuth.isLoggingOut,
    setIsLoggingOut: unifiedAuth.setIsLoggingOut
  };
};

// Export the new hook directly as well
export { useAuth } from '@/contexts/auth/AuthContext';
