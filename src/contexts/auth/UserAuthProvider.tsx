
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';
import { UserProfile } from '@/types/supabase/userProfile';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatible context value that matches the UserAuthContextType
  const userAuthValue = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup || (async () => false),
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: async (data: Partial<UserProfile>): Promise<boolean> => {
      if (auth.updateUserProfile) {
        return auth.updateUserProfile(data);
      }
      if (auth.updateProfile) {
        await auth.updateProfile(data as UserProfile);
        return true;
      }
      return false;
    },
    updatePassword: auth.updatePassword || (async () => false),
    user: auth.user,
    addToFavorites: (expertId: string) => auth.addToFavorites ? auth.addToFavorites(expertId) : Promise.resolve(false),
    removeFromFavorites: (expertId: string) => auth.removeFromFavorites ? auth.removeFromFavorites(expertId) : Promise.resolve(false),
    rechargeWallet: auth.addFunds || (async () => false),
    addReview: async (review: any) => {
      if (review && typeof review === 'object' && 'expertId' in review && 'rating' in review && 'comment' in review) {
        return auth.reviewExpert ? auth.reviewExpert(review.expertId.toString(), review.rating, review.comment) : false;
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
    getExpertShareLink: auth.getExpertShareLink || (() => ""),
    getReferralLink: auth.getReferralLink || (() => null),
    updateProfilePicture: auth.updateProfilePicture || (async () => ""),
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
