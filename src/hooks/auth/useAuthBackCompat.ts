
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
    logout: async () => {
      const result = await auth.logout();
      return !result.error;
    },
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: false,
    updateProfile: auth.updateProfile,
    updateProfilePicture: auth.updateProfilePicture || (async () => null),
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    getExpertShareLink: auth.getExpertShareLink,
    // Convert the return value to Promise<boolean> to match expected type
    hasTakenServiceFrom: async (expertId: number) => {
      if (!auth.hasTakenServiceFrom) return false;
      return await auth.hasTakenServiceFrom(expertId);
    },
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
    logout: async () => {
      const result = await auth.logout();
      return !result.error;
    },
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
