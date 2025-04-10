
import { useAuth } from '@/contexts/auth/AuthContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useAuthSynchronization } from '@/hooks/auth-sync';
import { useExpertAuth } from '@/features/expert-auth';

// This hook serves as a compatibility layer to help components transition to the new auth system
export const useAuthBackCompat = () => {
  const unifiedAuth = useAuth();
  const userAuth = useUserAuth();
  const expertAuth = useExpertAuth();
  const authSync = useAuthSynchronization();
  
  // Create a compatible object that merges all auth systems
  // and favors the unified auth when available
  const compatAuth = {
    // User data
    currentUser: unifiedAuth.state.userProfile || userAuth.currentUser,
    user: unifiedAuth.state.user || userAuth.user,
    
    // Expert data
    currentExpert: unifiedAuth.state.expertProfile || expertAuth.currentExpert,
    
    // Auth states
    isAuthenticated: unifiedAuth.state.isAuthenticated || userAuth.isAuthenticated || authSync.isAuthenticated,
    isLoading: unifiedAuth.state.isLoading || userAuth.loading || authSync.isAuthLoading,
    
    // Methods
    login: unifiedAuth.login || userAuth.login,
    signup: unifiedAuth.signup || userAuth.signup,
    logout: unifiedAuth.logout || userAuth.logout || authSync.userLogout,
    
    // Profile updates
    updateProfile: unifiedAuth.updateUserProfile || userAuth.updateProfile,
    updatePassword: unifiedAuth.updatePassword || userAuth.updatePassword,
    
    // Expert interactions
    reportExpert: (report: any) => {
      if (unifiedAuth.reportExpert) {
        return unifiedAuth.reportExpert(report.expertId, report.reason, report.details);
      }
      return userAuth.reportExpert(report);
    },
    
    hasTakenServiceFrom: unifiedAuth.hasTakenServiceFrom || userAuth.hasTakenServiceFrom,
    
    // Specific to new auth
    unifiedAuth,
    
    // Auth sync system
    authSync,
  };
  
  return compatAuth;
};
