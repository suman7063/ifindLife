
import { useEffect, useRef } from 'react';
import { AuthInitializationState } from './useAuthInitialization';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const useAuthSessionEffects = (
  authState: AuthInitializationState,
  fetchProfile: () => Promise<void>,
  setAuthLoading: (loading: boolean) => void
) => {
  const { user, loading } = useSupabaseAuth();
  const profileFetchAttempted = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts when unmounting
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Main effect to fetch profile when auth state changes
  useEffect(() => {
    // If already initialized and not loading, don't run this effect
    if (!authState.authLoading && authState.authInitialized) {
      return;
    }

    // If we have a user, attempt to fetch their profile
    if (user && !profileFetchAttempted.current) {
      console.log("User detected, fetching profile");
      profileFetchAttempted.current = true;
      
      fetchProfile().catch(error => {
        console.error("Error fetching profile:", error);
        setAuthLoading(false);
        profileFetchAttempted.current = false;
      });
    } 
    // If Supabase has completed loading and still no user, force loading to complete
    else if (loading === false && !user) {
      console.log("No user found after Supabase loading completed");
      
      // Only set timeout if we haven't already
      if (!loadingTimeoutRef.current) {
        loadingTimeoutRef.current = setTimeout(() => {
          console.log("Auth loading timeout reached, completing auth loading");
          setAuthLoading(false);
          profileFetchAttempted.current = false;
          loadingTimeoutRef.current = null;
        }, 500); // Reduced timeout to prevent long waits
      }
    }
  }, [user, loading, authState.authLoading, authState.authInitialized, fetchProfile, setAuthLoading]);
};
