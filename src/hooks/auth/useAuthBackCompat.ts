
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth/AuthContext';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/userProfileAdapter';

// This hook provides a backward-compatible interface for components 
// that expect the old UserAuthContext structure
export function useAuthBackCompat() {
  const auth = useContext(AuthContext);
  
  // Ensure we have a properly formatted profile object
  const profile = auth.userProfile ? adaptUserProfile(auth.userProfile) : null;
  
  // Map current auth context to the old UserAuthContext structure
  const backCompatContext = {
    currentUser: profile,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !profile && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword,
    user: auth.session?.user as User | null,
    refreshProfile: async () => {
      if (auth.refreshProfile) {
        await auth.refreshProfile();
      }
    },
    
    // These methods will be implemented later as needed
    addToFavorites: async (expertId: number) => false,
    removeFromFavorites: async (expertId: number) => false,
    rechargeWallet: async (amount: number) => false,
    addReview: async (review: any) => false,
    reportExpert: async (report: any) => false,
    getExpertShareLink: (expertId: number) => ``,
    hasTakenServiceFrom: (expertId: number) => false,
    getReferralLink: () => ``
  };
  
  return backCompatContext;
}
