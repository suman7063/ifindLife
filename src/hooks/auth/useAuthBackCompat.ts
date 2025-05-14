
import { useAuth } from '@/contexts/auth/AuthContext';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

export const useAuthBackCompat = () => {
  const auth = useAuth();
  const userAuth = useUserAuth();
  
  // Create compatible objects for both old and new auth systems
  const adaptedUserProfile = adaptUserProfile(auth.profile);
  
  const expertAuth = {
    currentExpert: auth.expertProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.loading,
    error: auth.error,
    hasProfile: !!auth.expertProfile,
    login: auth.login,
    logout: auth.logout,
    updateProfile: auth.updateProfile,
  };
  
  return {
    // New unified auth
    auth,
    
    // Old auth systems for backward compatibility
    userAuth,
    expertAuth,
    
    // Adapted profiles
    adaptedUserProfile
  };
};
