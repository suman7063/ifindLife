import { useAuth } from '@/contexts/auth/AuthContext';
import { NewReview, NewReport } from '@/types/supabase/tables';

/**
 * Provides backward compatibility with the old auth hooks
 */
export const useAuthBackCompat = () => {
  const authContext = useAuth();
  
  // Create an adapter for the addReview function that works in both cases
  const adaptedAddReview = async (reviewOrExpertId: NewReview | string, rating?: number, comment?: string): Promise<boolean> => {
    if (!authContext.addReview) return false;
    
    // If first arg is a string, use the traditional approach
    if (typeof reviewOrExpertId === 'string' && rating !== undefined) {
      return authContext.addReview(reviewOrExpertId, rating, comment || '');
    }
    
    // Otherwise, treat first arg as a review object
    if (typeof reviewOrExpertId === 'object') {
      const review = reviewOrExpertId as NewReview;
      return authContext.addReview(review);
    }
    
    return false;
  };
  
  // Create an adapter for the reportExpert function that works in both cases
  const adaptedReportExpert = async (reportOrExpertId: NewReport | string, reason?: string, details?: string): Promise<boolean> => {
    if (!authContext.reportExpert) return false;
    
    // If first arg is a string, use the traditional approach
    if (typeof reportOrExpertId === 'string' && reason !== undefined) {
      return authContext.reportExpert(reportOrExpertId, reason, details || '');
    }
    
    // Otherwise, treat first arg as a report object
    if (typeof reportOrExpertId === 'object') {
      const report = reportOrExpertId as NewReport;
      return authContext.reportExpert(report);
    }
    
    return false;
  };
  
  // Create a compatible interface for the old user auth hook
  const userAuth = {
    currentUser: authContext.userProfile,
    loading: authContext.isLoading,
    authLoading: authContext.isLoading, // This property is required for backward compatibility
    isAuthenticated: authContext.isAuthenticated && authContext.role === 'user',
    login: authContext.login,
    logout: authContext.logout,
    signup: authContext.signup,
    resetPassword: authContext.resetPassword,
    updateProfile: authContext.updateUserProfile,
    updatePassword: authContext.updatePassword,
    addReview: adaptedAddReview,
    reportExpert: adaptedReportExpert,
    hasTakenServiceFrom: async (expertId: string | number) => {
      return authContext.hasTakenServiceFrom ? 
        await authContext.hasTakenServiceFrom(expertId.toString()) : false;
    },
    getExpertShareLink: authContext.getExpertShareLink || ((expertId: string | number) => ''),
    getReferralLink: authContext.getReferralLink || (() => null),
    addToFavorites: async () => false,
    removeFromFavorites: async () => false,
    rechargeWallet: async () => false,
    updateProfilePicture: async () => null,
    user: authContext.user,
  };
  
  // Create a compatible interface for the old expert auth hook
  const expertAuth = {
    currentExpert: authContext.expertProfile,
    loading: authContext.isLoading,
    authLoading: authContext.isLoading, // Add this for backward compatibility as well
    isAuthenticated: authContext.isAuthenticated && authContext.role === 'expert',
    login: authContext.expertLogin,
    logout: authContext.logout,
    signup: authContext.expertSignup,
    updateProfile: authContext.updateExpertProfile,
    initialized: !authContext.isLoading,
  };
  
  return {
    userAuth,
    expertAuth
  };
};
