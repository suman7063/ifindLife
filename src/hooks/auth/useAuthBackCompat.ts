
import { useAuth } from '@/contexts/auth/AuthContext';
import { useEffect, useState } from 'react';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * This hook provides backward compatibility for components using the old auth context
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  const { toTypeA, toTypeB } = useProfileTypeAdapter();
  
  const [userProfileType, setUserProfileType] = useState<'A' | 'B' | null>(null);
  const [processedProfile, setProcessedProfile] = useState<UserProfileA | UserProfileB | null>(null);
  
  // Process profile when it changes to determine its type and convert if needed
  useEffect(() => {
    if (!auth.userProfile) {
      setProcessedProfile(null);
      setUserProfileType(null);
      return;
    }
    
    // Check if it's type A (has favorite_experts property)
    if ('favorite_experts' in auth.userProfile) {
      setUserProfileType('A');
      setProcessedProfile(auth.userProfile);
    }
    // Check if it's type B (has favoriteExperts property)
    else if ('favoriteExperts' in auth.userProfile) {
      setUserProfileType('B');
      setProcessedProfile(auth.userProfile);
    }
    // If unknown, assume it's type A and try to convert it
    else {
      setUserProfileType('A');
      setProcessedProfile(toTypeA(auth.userProfile as any));
    }
  }, [auth.userProfile]);
  
  // Prepare the user auth object that matches the old interface
  const userAuth = {
    currentUser: processedProfile,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading || auth.isLoading,
    authLoading: auth.isLoading,
    login: auth.signIn,
    signup: auth.signUp,
    logout: auth.signOut,
    updateProfile: (updates: Partial<UserProfileA | UserProfileB>) => {
      // Determine which type the updates are and convert if necessary
      if (userProfileType === 'A' && 'favoriteExperts' in updates) {
        // Convert type B updates to type A
        return auth.updateProfile(toTypeA(updates as UserProfileB) as any);
      } else if (userProfileType === 'B' && 'favorite_experts' in updates) {
        // Convert type A updates to type B
        return auth.updateProfile(toTypeB(updates as UserProfileA) as any);
      }
      // No conversion needed
      return auth.updateProfile(updates as any);
    },
    updatePassword: (password: string) => {
      // This functionality needs to be implemented in AuthContext
      console.warn('updatePassword is not fully implemented');
      return Promise.resolve(false);
    },
    profileNotFound: false, // Default value
    addToFavorites: () => Promise.resolve(false),
    removeFromFavorites: () => Promise.resolve(false),
    rechargeWallet: () => Promise.resolve(false),
    addReview: () => Promise.resolve(false),
    reportExpert: () => Promise.resolve(false),
    hasTakenServiceFrom: () => Promise.resolve(false),
    getExpertShareLink: () => '',
    getReferralLink: () => null,
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture
  };
  
  return {
    userAuth,
    auth,
    processedProfile,
    userProfileType
  };
};
