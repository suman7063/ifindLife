
import { useAuth } from '@/contexts/auth/AuthContext';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { AuthContextType } from '@/contexts/auth/types';

/**
 * Hook that provides backward compatibility for components expecting 
 * different UserProfile interfaces
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  const { toTypeA, toTypeB } = useProfileTypeAdapter();

  // Create a compatible profile that should work with both interfaces
  const adaptedProfile = auth.profile 
    ? 'favorite_experts' in auth.profile 
      ? auth.profile as UserProfileA 
      : toTypeA(auth.profile as UserProfileB)
    : null;

  // Create a compatible updateProfile function that works with both interfaces
  const adaptedUpdateProfile = async (updates: Partial<UserProfileA | UserProfileB>): Promise<boolean> => {
    if (!auth.updateProfile) return false;
    
    // Convert the updates to the type expected by auth.updateProfile
    const adaptedUpdates = 'favorite_programs' in updates && Array.isArray(updates.favorite_programs)
      ? {
          ...updates,
          favorite_programs: typeof updates.favorite_programs[0] === 'string'
            ? (updates.favorite_programs as string[]).map(id => Number(id))
            : updates.favorite_programs
        }
      : updates;
      
    return await auth.updateProfile(adaptedUpdates as any);
  };

  // Create an alternative userAuth object that's compatible with the old interface
  const userAuth = {
    currentUser: adaptedProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login || auth.signIn,
    signup: auth.signup || auth.signUp,
    logout: auth.logout || auth.signOut,
    loading: auth.isLoading,
    authLoading: auth.isLoading,
    profileNotFound: !auth.profile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: adaptedUpdateProfile,
    updatePassword: auth.updatePassword || (async () => false),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    rechargeWallet: auth.rechargeWallet || (async () => false),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async () => null),
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    
    // Additional methods that might be expected
    getExpertShareLink: auth.getExpertShareLink || ((id) => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    addReview: auth.addReview || (async () => false),
    reportExpert: auth.reportExpert || (async () => false),
  };

  return {
    auth, // original auth context
    userAuth, // compatible user auth object
    adaptedProfile, // the adapted profile
    adaptedUpdateProfile // the adapted update profile function
  };
};
