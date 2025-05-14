
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/auth/UserAuthContext';
import { UserProfile } from '@/types/supabase/user';

// Define the ExpertAuthContextType interface for backward compatibility
export interface ExpertAuthContextType {
  currentUser: any;  // Using any for expert profile
  updateProfile: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  loading?: boolean;
  currentExpert?: any;
}

// Create a hook that adapts the unified auth context to separate user and expert auth contexts
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create a backward-compatible user auth context
  const userAuth: UserAuthContextType = {
    currentUser: auth.profile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: async () => {
      const success = await auth.logout();
      return success;
    },
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isLoading && auth.isAuthenticated,
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
  
  // Create a backward-compatible expert auth context
  const expertAuth: ExpertAuthContextType = {
    currentUser: auth.expertProfile,
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    updateProfile: async (data: any) => {
      if (auth.updateProfile) {
        return auth.updateProfile(data);
      }
      return false;
    },
    logout: async () => {
      await auth.logout();
    },
    isLoading: auth.isLoading,
    loading: auth.isLoading
  };
  
  return {
    userAuth,
    expertAuth,
    // Include the unified auth context as well
    auth
  };
};
