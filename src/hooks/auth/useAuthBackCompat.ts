
import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/auth/UserAuthContext';
import { User } from '@supabase/supabase-js';
import { adaptUserProfile } from '@/utils/userProfileAdapter';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';

/**
 * This hook provides backwards compatibility for components
 * that use the old auth hooks
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create a compatible user auth context for old components
  const userAuth = useMemo<UserAuthContextType>(() => ({
    currentUser: adaptUserProfile(auth.profile),
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword || (async () => false),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    rechargeWallet: auth.rechargeWallet || (async () => false),
    addReview: async (review) => {
      return auth.addReview ? auth.addReview(review) : false;
    },
    reportExpert: async (report) => {
      return auth.reportExpert ? auth.reportExpert(report) : false;
    },
    hasTakenServiceFrom: async (expertId) => {
      return auth.hasTakenServiceFrom ? auth.hasTakenServiceFrom(expertId) : false;
    },
    getExpertShareLink: auth.getExpertShareLink || (() => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async () => null)
  }), [auth]);

  // Create a compatible expert auth context
  const expertAuth = useMemo(() => ({
    expert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    error: auth.error,
    login: async (email: string, password: string) => {
      return auth.login(email, password, 'expert');
    },
    logout: auth.logout,
    user: auth.user as User,
    updateProfile: (updates: Partial<ExpertProfile>) => {
      // This is a simplified implementation; the actual method would need to handle expert profile updates
      return Promise.resolve(false);
    }
  }), [auth]);

  return {
    userAuth,
    expertAuth
  };
};
