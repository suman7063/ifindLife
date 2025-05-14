
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
    login: auth.login,
    signup: auth.signup || (async () => false),
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword || (async () => false),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    rechargeWallet: auth.rechargeWallet || (async () => false),
    addReview: auth.addReview || (async () => false),
    reportExpert: auth.reportExpert || (async () => false),
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async () => null)
  };
  
  // Create compatibility layer for expertAuth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    login: auth.login,
    logout: auth.logout,
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
