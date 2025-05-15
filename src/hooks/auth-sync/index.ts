import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Hook to synchronize authentication state between different parts of the app
 */
export const useAuthSync = () => {
  const auth = useAuth();
  const { toTypeA, toTypeB } = useProfileTypeAdapter();
  
  // Access profile with proper type handling
  const getUserProfile = (): UserProfileA | null => {
    if (!auth.profile) return null;
    
    // If profile already has favorite_experts, assume it's already UserProfileA
    if ('favorite_experts' in auth.profile) {
      return auth.profile as UserProfileA;
    }
    
    // Otherwise convert from UserProfileB
    return toTypeA(auth.profile as UserProfileB);
  };
  
  // Convert profile for use with APIs that expect UserProfileB
  const getTypeB = (): UserProfileB | null => {
    if (!auth.profile) return null;
    
    // If profile already has favorite_programs as number[], assume it's already UserProfileB
    if ('favorite_programs' in auth.profile && 
        Array.isArray(auth.profile.favorite_programs) && 
        auth.profile.favorite_programs.length > 0 && 
        typeof auth.profile.favorite_programs[0] === 'number') {
      return auth.profile as UserProfileB;
    }
    
    // Otherwise convert from UserProfileA
    return toTypeB(auth.profile as UserProfileA);
  };
  
  return {
    auth,
    getUserProfile,
    getTypeB,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    session: auth.session
  };
};
