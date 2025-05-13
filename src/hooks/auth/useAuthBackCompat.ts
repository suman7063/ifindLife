
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/UserAuthContext';

// This hook provides backward compatibility with the old UserAuthContext
export const useAuthBackCompat = () => {
  const auth = useAuth();

  // Create a backward compatible interface
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
    profileNotFound: !auth.profile && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updateProfilePicture: auth.updateProfilePicture,
    updatePassword: auth.updatePassword,
    addToFavorites: async (expertId: number) => {
      return await auth.addToFavorites(expertId);
    },
    removeFromFavorites: async (expertId: number) => {
      return await auth.removeFromFavorites(expertId);
    },
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    getExpertShareLink: auth.getExpertShareLink,
    hasTakenServiceFrom: async (expertId: number) => {
      return await auth.hasTakenServiceFrom(expertId);
    },
    getReferralLink: auth.getReferralLink,
    user: auth.user,
    refreshProfile: async () => {
      const profile = await auth.fetchProfile();
      return;
    }
  };

  return {
    userAuth,
    auth
  };
};
