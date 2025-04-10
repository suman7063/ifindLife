
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatible context value that matches the UserAuthContextType
  const userAuthValue = {
    currentUser: auth.state.userProfile,
    isAuthenticated: auth.state.isAuthenticated && auth.state.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.state.isLoading,
    loading: auth.state.isLoading,
    profileNotFound: !auth.state.userProfile && !auth.state.isAuthenticated && !auth.state.isLoading,
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    user: auth.state.user,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.addFunds,
    addReview: async (review: any) => {
      if (review && typeof review === 'object' && 'expertId' in review && 'rating' in review && 'comment' in review) {
        return auth.reviewExpert(review.expertId.toString(), review.rating, review.comment);
      }
      return false;
    },
    reportExpert: async (report: any) => {
      if (report && typeof report === 'object' && 'expertId' in report && 'reason' in report && 'details' in report) {
        return auth.reportExpert(report.expertId.toString(), report.reason, report.details);
      }
      return false;
    },
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink,
    getReferralLink: auth.getReferralLink,
    updateProfilePicture: async () => null
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
