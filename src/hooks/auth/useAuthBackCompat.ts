
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/database/unified';

/**
 * Provides backward compatibility for components using
 * the old auth hook interfaces
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Backward compatible user auth
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword,
    user: auth.user,
    // Add missing methods with warning logs
    addToFavorites: async (expertId: number) => {
      console.warn('addToFavorites is not implemented in new auth system');
      return false;
    },
    removeFromFavorites: async (expertId: number) => {
      console.warn('removeFromFavorites is not implemented in new auth system');
      return false;
    },
    rechargeWallet: async (amount: number) => {
      console.warn('rechargeWallet is not implemented in new auth system');
      return false;
    },
    addReview: async (review: any) => {
      console.warn('addReview is not implemented in new auth system');
      return false;
    },
    reportExpert: async (report: any) => {
      console.warn('reportExpert is not implemented in new auth system');
      return false;
    },
    hasTakenServiceFrom: (expertId: number) => {
      console.warn('hasTakenServiceFrom is not implemented in new auth system');
      return false;
    },
    getExpertShareLink: (expertId: number) => {
      console.warn('getExpertShareLink is not implemented in new auth system');
      return '';
    },
    getReferralLink: () => {
      console.warn('getReferralLink is not implemented in new auth system');
      return '';
    },
    refreshProfile: auth.refreshProfile,
    updateProfilePicture: async (file: File) => {
      console.warn('updateProfilePicture is not implemented in new auth system');
      return null;
    }
  };
  
  // Backward compatible expert auth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    error: auth.error?.message || null,
    initialized: true,
    user: auth.user
  };
  
  return {
    userAuth,
    expertAuth,
    unifiedAuth: auth
  };
};
