import { useAuth } from '@/contexts/auth/AuthContext';
import { NewReview, NewReport } from '@/types/supabase/tables';

/**
 * Provides backward compatibility with the old auth hooks
 */
export const useAuthBackCompat = () => {
  const authContext = useAuth();
  
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
    // Adapt addReview to match the expected signature of the old interface
    addReview: async (review: NewReview): Promise<boolean> => {
      if (authContext.addReview && review) {
        return authContext.addReview(
          review.expertId.toString(),
          review.rating,
          review.comment || ''
        );
      }
      return false;
    },
    // Adapt reportExpert to match the expected signature of the old interface
    reportExpert: async (report: NewReport): Promise<boolean> => {
      if (authContext.reportExpert && report) {
        return authContext.reportExpert(
          report.expertId.toString(),
          report.reason,
          report.details || ''
        );
      }
      return false;
    },
    // Other methods with proper conversion
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
