
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
      
      // Execute profile fetch immediately
      fetchProfile()
        .catch(error => {
          console.error("Error fetching profile:", error);
          if (isMounted.current) {
            setAuthLoading(false);
            profileFetchAttempted.current = false;
          }
        });
    } 
    // If Supabase has completed loading and still no user, force loading to complete
    else if (loading === false && !user) {
      console.log("No user found after Supabase loading completed");
      
      // Set a short timeout to ensure we don't have any race conditions
      if (!loadingTimeoutRef.current) {
        loadingTimeoutRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          
          console.log("Auth loading timeout reached, completing auth loading");
          setAuthLoading(false);
          profileFetchAttempted.current = false;
          loadingTimeoutRef.current = null;
        }, 300);
      }
    }
  }, [user, loading, authState.authLoading, authState.authInitialized, fetchProfile, setAuthLoading]);

  // Add a definitive maximum loading timeout
  useEffect(() => {
    const maxTimeout = setTimeout(() => {
      if (authState.authLoading && isMounted.current) {
        console.log("Force completing auth loading after timeout");
        setAuthLoading(false);
      }
    }, 2000); // 2 seconds maximum loading time
    
    return () => clearTimeout(maxTimeout);
  }, [authState.authLoading, setAuthLoading]);
};
