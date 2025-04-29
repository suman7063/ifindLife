
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatible context value that matches the UserAuthContextType
  const userAuthValue = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading, // Add this for consistency
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    addToFavorites: async () => false, // Not implemented in unified auth
    removeFromFavorites: async () => false, // Not implemented in unified auth
    rechargeWallet: async () => false, // Not implemented in unified auth
    addReview: async (review: any) => {
      if (review && typeof review === 'object' && 'expertId' in review && 'rating' in review && 'comment' in review) {
        return auth.addReview ? auth.addReview(review.expertId.toString(), review.rating, review.comment) : false;
      }
      return false;
    },
    reportExpert: async (report: any) => {
      if (report && typeof report === 'object' && 'expertId' in report && 'reason' in report && 'details' in report) {
        return auth.reportExpert ? auth.reportExpert(report.expertId.toString(), report.reason, report.details) : false;
      }
      return false;
    },
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    getExpertShareLink: auth.getExpertShareLink || ((expertId: string | number) => ''),
    getReferralLink: auth.getReferralLink || (() => ''),
    user: auth.user,
    updateProfilePicture: async () => null
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
