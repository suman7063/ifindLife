
// Backward compatibility layer for existing components
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth/AuthContext';

export const useAuthSynchronization = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // Provide fallback values instead of throwing to prevent crashes
    console.warn("useAuthSynchronization used outside of AuthProvider - using fallback values");
    return {
      isAuthenticated: false,
      isExpertAuthenticated: false,
      isUserAuthenticated: false,
      currentUser: null,
      currentExpert: null,
      userLogout: async () => false,
      expertLogout: async () => false,
      fullLogout: async () => false,
      hasDualSessions: false,
      isSynchronizing: false,
      authCheckCompleted: true,
      isAuthInitialized: true,
      isAuthLoading: false,
      sessionType: 'none'
    };
  }
  
  return {
    isAuthenticated: context.isAuthenticated,
    isExpertAuthenticated: context.role === 'expert' && context.isAuthenticated,
    isUserAuthenticated: context.role === 'user' && context.isAuthenticated,
    currentUser: context.userProfile,
    currentExpert: context.expertProfile,
    userLogout: context.logout,
    expertLogout: context.logout,
    fullLogout: context.logout,
    hasDualSessions: false,
    isSynchronizing: context.isLoading,
    authCheckCompleted: !context.isLoading,
    isAuthInitialized: !context.isLoading,
    isAuthLoading: context.isLoading,
    sessionType: context.sessionType || 'none'
  };
};

// Export the new hook directly as well
export { useAuth } from '@/contexts/auth/AuthContext';
