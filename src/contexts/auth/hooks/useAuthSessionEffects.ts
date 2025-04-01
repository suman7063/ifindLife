
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
    // Skip this effect if we're already initialized
    if (!authState.authLoading && authState.authInitialized) {
      return;
    }

    // If we have a user, attempt to fetch their profile
    if (user && !profileFetchAttempted.current) {
      console.log("User detected, fetching profile");
      profileFetchAttempted.current = true;
      
      // Execute profile fetch
      fetchProfile()
        .then(() => {
          if (isMounted.current) {
            setAuthLoading(false);
          }
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          if (isMounted.current) {
            setAuthLoading(false);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            profileFetchAttempted.current = false;
          }
        });
    } 
    // If Supabase has completed loading and still no user, force loading to complete
    else if (loading === false) {
      console.log("Supabase loading completed");
      
      // Force complete loading after a short timeout
      if (!loadingTimeoutRef.current) {
        loadingTimeoutRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          
          console.log("Auth loading timeout reached, completing auth loading");
          setAuthLoading(false);
          profileFetchAttempted.current = false;
          loadingTimeoutRef.current = null;
        }, 200);
      }
    }
  }, [user, loading, authState.authLoading, authState.authInitialized, fetchProfile, setAuthLoading]);

  // Add a definitive maximum loading timeout to prevent infinite loading
  useEffect(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      if (authState.authLoading && isMounted.current) {
        console.log("Force completing auth loading after timeout");
        setAuthLoading(false);
        profileFetchAttempted.current = false;
      }
    }, 2000); // 2 seconds maximum loading time
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [authState.authLoading, setAuthLoading]);
};
