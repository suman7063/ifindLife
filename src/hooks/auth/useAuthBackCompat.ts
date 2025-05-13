
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/UserAuthContext';

/**
 * Backward compatibility layer for existing components that use the old auth hooks
 */
export const useAuthBackCompat = () => {
  // Get auth from the unified context
  const auth = useAuth();
  
  // Create a backward-compatible user auth object
  const userAuth: UserAuthContextType = {
    currentUser: auth.profile,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: false,
    updateProfile: auth.updateProfile,
    updateProfilePicture: auth.updateProfilePicture,
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    getExpertShareLink: auth.getExpertShareLink,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getReferralLink: auth.getReferralLink,
    refreshProfile: async () => {
      // Refresh profile implementation
      if (auth.fetchProfile) {
        await auth.fetchProfile();
      }
    },
    user: auth.user
  };

  // Create a backward-compatible expert auth object
  const expertAuth = {
    login: auth.login,
    logout: auth.logout,
    loading: auth.isLoading,
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    initialized: !auth.isLoading,
    hasUserAccount: async () => {
      // For backward compatibility
      return false;
    }
  };

  return {
    userAuth,
    expertAuth
  };
};
