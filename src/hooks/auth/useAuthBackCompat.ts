
import { useAuth } from '@/contexts/auth';

// This hook provides backward compatibility for components using the old auth hooks
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Format the data for user auth
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: async () => {
      const result = await auth.logout();
      return !result.error;
    },
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user
  };
  
  // Format the data for expert auth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    login: auth.login,
    logout: async () => {
      const result = await auth.logout();
      return !result.error;
    },
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.expertProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateExpertProfile,
    user: auth.user
  };
  
  return {
    userAuth,
    expertAuth,
    auth
  };
};
