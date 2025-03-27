
import { useEffect } from 'react';
import { AuthInitializationState } from './useAuthInitialization';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const useAuthSessionEffects = (
  authState: AuthInitializationState,
  fetchProfile: () => Promise<void>
) => {
  const { user, loading } = useSupabaseAuth();

  // Main effect to fetch profile when auth state changes
  useEffect(() => {
    // This useEffect will run whenever the session or user changes
    if (user) {
      // If we have a user, attempt to fetch their profile
      console.log("User detected, fetching profile");
      fetchProfile().catch(error => {
        console.error("Error fetching profile:", error);
      });
    } else if (loading === false) {
      // If Supabase has completed loading and still no user, force loading to complete
      console.log("No user found after Supabase loading completed");
      
      const timeoutId = setTimeout(() => {
        if (authState.authLoading) {
          console.log("Auth loading timeout reached, forcing completion");
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, fetchProfile, authState.authLoading, loading]);

  // Additional effect to handle loading state when logged out
  useEffect(() => {
    if (!user && authState.authLoading) {
      // If no user is present but still loading, force complete after short timeout
      const timeoutId = setTimeout(() => {
        console.log("No user found, completing auth loading");
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, authState.authLoading]);
};
