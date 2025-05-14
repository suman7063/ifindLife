
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/auth/UserAuthContext';

/**
 * Hook to provide backward compatibility with old user and expert auth hooks
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create compatibility layer for userAuth
  const userAuth: UserAuthContextType = {
    currentUser: auth.profile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login || auth.signIn,
    signup: auth.signup || auth.signUp,
    logout: auth.logout || auth.signOut,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: async (data) => {
      const result = await auth.updateProfile(data);
      return result;
    },
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture
  };
  
  // Create compatibility layer for expertAuth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    login: auth.login || auth.signIn,
    logout: auth.logout || auth.signOut,
    loading: auth.isLoading,
    updateExpert: auth.updateExpertProfile,
    updateProfilePicture: auth.updateProfilePicture,
    user: auth.user
  };
  
  return {
    userAuth,
    expertAuth,
    // Also expose the original auth context
    auth
  };
};
