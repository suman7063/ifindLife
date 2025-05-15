
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMemo } from 'react';

/**
 * Provides backward compatibility for components that use the old auth patterns
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create user auth compatible interface
  const userAuth = useMemo(() => {
    return {
      currentUser: auth.userProfile,
      isAuthenticated: auth.isAuthenticated && !!auth.userProfile,
      login: auth.login,
      signup: auth.signup,
      logout: auth.logout,
      loading: auth.isLoading,
      authLoading: auth.isLoading,
      profileNotFound: auth.isAuthenticated && !auth.userProfile,
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
      refreshProfile: auth.refreshProfile,
      user: auth.user
    };
  }, [auth]);
  
  // Create expert auth compatible interface
  const expertAuth = useMemo(() => {
    return {
      currentExpert: auth.expertProfile,
      expert: auth.expertProfile,
      isAuthenticated: auth.isAuthenticated && !!auth.expertProfile,
      login: auth.login,
      register: auth.registerExpert || auth.signup,
      logout: auth.logout,
      loading: auth.isLoading,
      authLoading: auth.isLoading,
      profileNotFound: auth.isAuthenticated && !auth.expertProfile,
      updateExpertProfile: auth.updateProfile,
      updatePassword: auth.updatePassword,
      refreshProfile: auth.refreshProfile
    };
  }, [auth]);
  
  return { userAuth, expertAuth, auth };
};
