
import { useAuth } from '@/contexts/auth/AuthContext';
import { useUserAuth } from '@/contexts/auth/hooks/useUserAuth';

/**
 * A compatibility layer for gradually transitioning from separate hooks to unified auth
 */
export const useAuthBackCompat = () => {
  const unifiedAuth = useAuth();
  const legacyUserAuth = useUserAuth();
  
  return {
    // Direct access to both contexts
    unifiedAuth,
    userAuth: legacyUserAuth,
    expertAuth: {
      currentExpert: unifiedAuth.expertProfile,
      isAuthenticated: unifiedAuth.isAuthenticated && unifiedAuth.role === 'expert',
      login: unifiedAuth.login,
      signup: unifiedAuth.signup,
      logout: unifiedAuth.logout,
      loading: unifiedAuth.isLoading
    }
  };
};
