
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';
import { NewReview, NewReport } from '@/types/supabase/tables';
import { ensureStringIdArray } from '@/utils/idConverters';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatible addReview function that can handle both calling styles
  const adaptedAddReview = async (reviewOrExpertId: NewReview | string, rating?: number, comment?: string): Promise<boolean> => {
    // If first parameter is a string, assume it's the old style with separate parameters
    if (typeof reviewOrExpertId === 'string' && rating !== undefined) {
      return auth.addReview ? auth.addReview({
        expertId: parseInt(reviewOrExpertId),
        rating,
        comment: comment || '',
      }) : Promise.resolve(false);
    }
    
    // If first parameter is an object, handle as a review object
    if (reviewOrExpertId && typeof reviewOrExpertId === 'object' && auth.addReview) {
      return auth.addReview(reviewOrExpertId as NewReview);
    }
    
    return false;
  };

  // Create a compatible reportExpert function that can handle both calling styles
  const adaptedReportExpert = async (reportOrExpertId: NewReport | string, reason?: string, details?: string): Promise<boolean> => {
    // If first parameter is a string, assume it's the old style with separate parameters
    if (typeof reportOrExpertId === 'string' && reason !== undefined && auth.reportExpert) {
      return auth.reportExpert({
        expertId: parseInt(reportOrExpertId),
        reason,
        details: details || '',
      });
    }
    
    // If first parameter is an object, handle as a report object
    if (reportOrExpertId && typeof reportOrExpertId === 'object' && auth.reportExpert) {
      return auth.reportExpert(reportOrExpertId as NewReport);
    }
    
    return false;
  };
  
  // Define a properly typed hasTakenServiceFrom function that handles both Promise and non-Promise cases
  const adaptedHasTakenServiceFrom = async (id: string | number): Promise<boolean> => {
    if (!auth.hasTakenServiceFrom) return Promise.resolve(false);
    
    try {
      const result = auth.hasTakenServiceFrom(id);
      return result instanceof Promise ? result : Promise.resolve(result);
    } catch (error) {
      console.error("Error in hasTakenServiceFrom:", error);
      return Promise.resolve(false);
    }
  };

  // Adapt logout function to return boolean
  const adaptedLogout = async (): Promise<boolean> => {
    try {
      const result = await auth.logout();
      return result && !result.error;
    } catch (error) {
      console.error("Error in logout:", error);
      return false;
    }
  };
  
  // Create a compatible context value that matches the UserAuthContextType
  // Ensure we convert favorite_experts to string[] if it's number[]
  const currentUser = auth.profile ? {
    ...auth.profile,
    favorite_experts: auth.profile.favorite_experts ? ensureStringIdArray(auth.profile.favorite_experts) : []
  } : null;
  
  const userAuthValue = {
    currentUser,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup || (async () => false),
    logout: adaptedLogout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile, // Use updateProfile instead of updateUserProfile
    updatePassword: auth.updatePassword || (async () => false),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    rechargeWallet: auth.rechargeWallet || (async () => false),
    addReview: adaptedAddReview,
    reportExpert: adaptedReportExpert,
    hasTakenServiceFrom: adaptedHasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: async () => null
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
