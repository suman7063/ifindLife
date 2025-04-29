
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * Provides backward compatibility with the old auth hooks
 */
export const useAuthBackCompat = () => {
  const authContext = useAuth();
  
  // Create a compatible interface for the old user auth hook
  const userAuth = {
    currentUser: authContext.userProfile,
    loading: authContext.isLoading,
    authLoading: authContext.isLoading, // This property is required for backward compatibility
    isAuthenticated: authContext.isAuthenticated && authContext.role === 'user',
    login: authContext.login,
    logout: authContext.logout,
    signup: authContext.signup,
    resetPassword: authContext.resetPassword,
    updateProfile: authContext.updateUserProfile,
    updatePassword: authContext.updatePassword,
  };
  
  // Create a compatible interface for the old expert auth hook
  const expertAuth = {
    currentExpert: authContext.expertProfile,
    loading: authContext.isLoading,
    authLoading: authContext.isLoading, // Add this for backward compatibility as well
    isAuthenticated: authContext.isAuthenticated && authContext.role === 'expert',
    login: authContext.expertLogin,
    logout: authContext.logout,
    signup: authContext.expertSignup,
    updateProfile: authContext.updateExpertProfile,
    initialized: !authContext.isLoading,
  };
  
  return {
    userAuth,
    expertAuth
  };
};
