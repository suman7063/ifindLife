
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
    // Don't run this effect if auth is not loading anymore
    if (!authState.authLoading) return;

    // If we have a user, attempt to fetch their profile
    if (user && !profileFetchAttempted.current) {
      console.log("User detected, fetching profile");
      profileFetchAttempted.current = true;
      
      fetchProfile().catch(error => {
        console.error("Error fetching profile:", error);
        setAuthLoading(false);
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
          loadingTimeoutRef.current = null;
        }, 1000);
      }
    }
  }, [user, loading, authState.authLoading, fetchProfile, setAuthLoading]);
};
