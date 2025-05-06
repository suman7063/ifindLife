
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * A hook that provides compatibility with both older user and expert auth hooks
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Extract user-specific auth functionality
  const userAuth = {
    currentUser: auth.userProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    isLoading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    signup: auth.signup,
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    resetPassword: auth.resetPassword,
    loading: auth.isLoading,
    authLoading: auth.isLoading,
    role: auth.role
  };
  
  // Extract expert-specific auth functionality
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    isLoading: auth.isLoading,
    login: auth.expertLogin,
    logout: auth.logout,
    register: auth.expertSignup,
    updateProfile: auth.updateExpertProfile,
    loading: auth.isLoading,
    authLoading: auth.isLoading,
    role: auth.role,
    user: auth.user,
    initialized: !auth.isLoading,
    authInitialized: !auth.isLoading
  };
  
  return { userAuth, expertAuth, auth };
};
