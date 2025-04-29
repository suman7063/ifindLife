
import React, { createContext, useContext } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useAuthFunctions } from './hooks/useAuthFunctions';
import { useProfileFunctions } from './hooks/useProfileFunctions';
import { useExpertInteractions } from './hooks/useExpertInteractions';
import { AuthContextType, initialAuthState, UserRole } from './types';
import { NewReview, NewReport } from '@/types/supabase/tables';

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState, checkUserRole, fetchUserData } = useAuthState();
  
  const { 
    login,
    signup,
    expertLogin,
    expertSignup,
    logout
  } = useAuthFunctions(authState, setAuthState, fetchUserData);
  
  const {
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword
  } = useProfileFunctions(authState, setAuthState);

  const userId = authState.user?.id || null;
  const expertInteractions = useExpertInteractions(userId);
  
  // Create functions that work with both calling styles
  const adaptedAddReview: AuthContextType['addReview'] = function(
    expertIdOrReview: string | NewReview,
    rating?: number,
    comment?: string
  ): Promise<boolean> {
    if (typeof expertIdOrReview === 'object') {
      // Handle NewReview object
      const review = expertIdOrReview;
      return expertInteractions.addReview(
        review.expertId.toString(),
        review.rating,
        review.comment || ''
      );
    } else {
      // Handle individual parameters
      return expertInteractions.addReview(
        expertIdOrReview,
        rating!,
        comment || ''
      );
    }
  };
  
  const adaptedReportExpert: AuthContextType['reportExpert'] = function(
    expertIdOrReport: string | NewReport,
    reason?: string,
    details?: string
  ): Promise<boolean> {
    if (typeof expertIdOrReport === 'object') {
      // Handle NewReport object
      const report = expertIdOrReport;
      return expertInteractions.reportExpert(
        report.expertId.toString(),
        report.reason,
        report.details || ''
      );
    } else {
      // Handle individual parameters
      return expertInteractions.reportExpert(
        expertIdOrReport,
        reason!,
        details || ''
      );
    }
  };

  // Determine session type
  let sessionType: 'none' | 'user' | 'expert' | 'dual' = 'none';
  if (authState.role === 'user') sessionType = 'user';
  else if (authState.role === 'expert') sessionType = 'expert';
  // Dual is not currently supported in the unified auth system
  
  // Combine all functions and state into context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    expertLogin,
    expertSignup,
    logout,
    checkUserRole,
    updateUserProfile,
    updateExpertProfile,
    resetPassword,
    updatePassword,
    addReview: adaptedAddReview,
    reportExpert: adaptedReportExpert,
    hasTakenServiceFrom: expertInteractions.hasTakenServiceFrom,
    getExpertShareLink: expertInteractions.getExpertShareLink,
    getReferralLink: expertInteractions.getReferralLink,
    
    // Backward compatibility properties
    currentUser: authState.userProfile,
    currentExpert: authState.expertProfile,
    sessionType,
    authLoading: authState.isLoading // Ensure authLoading is included for backward compatibility
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export types for consumers
export type { UserRole, AuthContextType };
