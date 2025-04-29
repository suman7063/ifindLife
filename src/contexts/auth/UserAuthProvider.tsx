
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';
import { NewReview, NewReport } from '@/types/supabase/tables';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatible addReview function that can handle both calling styles
  const adaptedAddReview = async (reviewOrExpertId: NewReview | string, rating?: number, comment?: string): Promise<boolean> => {
    // If first parameter is a string, assume it's the old style with separate parameters
    if (typeof reviewOrExpertId === 'string' && rating !== undefined) {
      return auth.addReview ? await auth.addReview(reviewOrExpertId, rating, comment || '') : false;
    }
    
    // If first parameter is an object, handle as a review object
    if (reviewOrExpertId && typeof reviewOrExpertId === 'object' && 'expertId' in reviewOrExpertId && 'rating' in reviewOrExpertId) {
      const review = reviewOrExpertId as NewReview;
      return auth.addReview ? 
        await auth.addReview(review.expertId.toString(), review.rating, review.comment || '') : false;
    }
    
    return false;
  };

  // Create a compatible reportExpert function that can handle both calling styles
  const adaptedReportExpert = async (reportOrExpertId: NewReport | string, reason?: string, details?: string): Promise<boolean> => {
    // If first parameter is a string, assume it's the old style with separate parameters
    if (typeof reportOrExpertId === 'string' && reason !== undefined) {
      return auth.reportExpert ? await auth.reportExpert(reportOrExpertId, reason, details || '') : false;
    }
    
    // If first parameter is an object, handle as a report object
    if (reportOrExpertId && typeof reportOrExpertId === 'object' && 'expertId' in reportOrExpertId && 'reason' in reportOrExpertId) {
      const report = reportOrExpertId as NewReport;
      return auth.reportExpert ? 
        await auth.reportExpert(report.expertId.toString(), report.reason, report.details || '') : false;
    }
    
    return false;
  };
  
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
    addReview: adaptedAddReview,
    reportExpert: adaptedReportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async (expertId: string | number) => false),
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
