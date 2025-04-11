
import { useAuth } from '@/contexts/auth/AuthContext';
import { useState, useEffect } from 'react';

export const useAuthBackCompat = () => {
  const auth = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Wait for auth initialization to complete
  useEffect(() => {
    if (!auth.isLoading) {
      setIsInitializing(false);
    }
  }, [auth.isLoading]);
  
  // Compatibility layer for useUserAuth
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    authLoading: auth.isLoading || isInitializing,
    profileNotFound: !auth.userProfile && !auth.isLoading && auth.isAuthenticated,
    user: auth.user,
    loading: auth.isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateProfile: auth.updateUserProfile,
    refreshProfile: async () => {
      // Implement refreshProfile to satisfy the interface
      if (auth.userProfile?.id) {
        try {
          // This is just a placeholder implementation
          console.log('Refreshing profile for user:', auth.userProfile.id);
          return Promise.resolve();
        } catch (error) {
          console.error('Error refreshing profile:', error);
          return Promise.reject(error);
        }
      }
      return Promise.resolve();
    },
    updateProfilePicture: async () => null, // Not implemented in unified auth
    updatePassword: auth.updatePassword,
    addToFavorites: async () => false, // Not implemented in unified auth
    removeFromFavorites: async () => false, // Not implemented in unified auth
    rechargeWallet: async () => false, // Not implemented in unified auth
    addReview: async (review: any) => {
      if (auth.addReview && review) {
        if (typeof review === 'object') {
          const expertId = review.expertId || review.expert_id;
          const rating = review.rating;
          const comment = review.comment;
          if (expertId && rating) {
            return auth.addReview(expertId.toString(), rating, comment || '');
          }
        }
      }
      return false;
    },
    reportExpert: async (report: any) => {
      if (auth.reportExpert && report) {
        if (typeof review === 'object') {
          const expertId = report.expertId || report.expert_id;
          const reason = report.reason;
          const details = report.details || '';
          if (expertId && reason) {
            return auth.reportExpert(expertId.toString(), reason, details);
          }
        }
      }
      return false;
    },
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null)
  };
  
  // Compatibility layer for useExpertAuth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    isLoading: auth.isLoading,
    error: null,
    initialized: !auth.isLoading,
    authInitialized: !auth.isLoading,
    user: auth.user,
    login: auth.expertLogin,
    logout: auth.logout,
    register: auth.expertSignup,
    updateProfile: auth.updateExpertProfile,
    hasUserAccount: async () => {
      const role = await auth.checkUserRole();
      return role === 'user';
    }
  };
  
  // Compatibility layer for useAuthSynchronization
  const authSync = {
    isAuthInitialized: !auth.isLoading,
    isAuthLoading: auth.isLoading,
    isUserAuthenticated: auth.isAuthenticated && auth.role === 'user',
    isExpertAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    userLogout: auth.logout,
    expertLogout: auth.logout,
    fullLogout: auth.logout,
    hasDualSessions: false, // Not supported in unified auth
    isSynchronizing: false, // Not supported in unified auth
    authCheckCompleted: !auth.isLoading,
    // Add back compatibility properties
    isAuthenticated: auth.isAuthenticated,
    currentUser: auth.userProfile,
    currentExpert: auth.expertProfile,
    sessionType: auth.sessionType || 'none'
  };
  
  return { userAuth, expertAuth, authSync };
};
