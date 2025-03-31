
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
  const isMounted = useRef(true);

  // Set up cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
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
      
      // Use setTimeout to avoid React state update conflicts
      setTimeout(() => {
        if (!isMounted.current) return;
        
        fetchProfile().catch(error => {
          console.error("Error fetching profile:", error);
          if (isMounted.current) {
            setAuthLoading(false);
            profileFetchAttempted.current = false;
          }
        });
      }, 0);
    } 
    // If Supabase has completed loading and still no user, force loading to complete
    else if (loading === false && !user) {
      console.log("No user found after Supabase loading completed");
      
      // Only set timeout if we haven't already
      if (!loadingTimeoutRef.current) {
        loadingTimeoutRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          
          console.log("Auth loading timeout reached, completing auth loading");
          setAuthLoading(false);
          profileFetchAttempted.current = false;
          loadingTimeoutRef.current = null;
        }, 500);
      }
    }
  }, [user, loading, authState.authLoading, authState.authInitialized, fetchProfile, setAuthLoading]);
};
