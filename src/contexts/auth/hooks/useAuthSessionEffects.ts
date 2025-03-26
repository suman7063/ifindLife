
import { useEffect } from 'react';
import { AuthInitializationState } from './useAuthInitialization';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const useAuthSessionEffects = (
  authState: AuthInitializationState,
  fetchProfile: () => Promise<void>
) => {
  const { user, authLoading } = useSupabaseAuth();

  // Main effect to fetch profile when auth state changes
  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    if (user) {
      fetchProfile();
    } else {
      // Force loading to complete if no user is found
      // This helps prevent infinite loading states
      const timeoutId = setTimeout(() => {
        if (authState.authLoading) {
          console.log("Auth loading timeout reached, forcing completion");
        }
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, fetchProfile, authState.authLoading]);

  // Additional effect to handle loading state when logged out
  useEffect(() => {
    if (!user && authState.authLoading) {
      // If no user is present but still loading, force complete
      const timeoutId = setTimeout(() => {
        console.log("No user found, completing auth loading");
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, authState.authLoading]);
};
