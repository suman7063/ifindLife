
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/auth/UserAuthContext';
import { ExpertAuthContextType } from '@/contexts/auth/ExpertAuthContext';

/**
 * This hook provides backward compatibility for components expecting the old auth context structure.
 * It should be gradually phased out as components are updated to use the new unified auth context.
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Adapt the auth context to match the old UserAuth structure
  const userAuth: UserAuthContextType = {
    currentUser: auth.profile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup || (async () => false),
    logout: async () => {
      try {
        await auth.logout();
        return true;
      } catch (error) {
        console.error("Error in logout:", error);
        return false;
      }
    },
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword || (async () => false),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    rechargeWallet: auth.rechargeWallet || (async () => false),
    addReview: auth.addReview || (async () => false),
    reportExpert: auth.reportExpert || (async () => false),
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async () => null)
  };
  
  // Adapt the auth context to match the old ExpertAuth structure
  const expertAuth: ExpertAuthContextType = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    login: auth.login,
    logout: async () => {
      try {
        await auth.logout();
        return true;
      } catch (error) {
        console.error("Error in expert logout:", error);
        return false;
      }
    },
    register: auth.signup || (async () => false),
    hasUserAccount: async () => auth.sessionType === 'dual',
    updateProfile: auth.updateProfile || (async () => false),
    initialized: !auth.isLoading,
    error: null
  };
  
  return { userAuth, expertAuth, unifiedAuth: auth };
};
