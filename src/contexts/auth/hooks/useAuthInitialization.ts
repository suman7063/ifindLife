
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/user';

export const useAuthInitialization = (setIsAuthenticated: (value: boolean) => void, setCurrentUser: (user: UserProfile | null) => void) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }
      
      if (!session) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }
      
      const userProfile = await fetchUserProfile(session.user.id);
      
      if (userProfile) {
        // Cast to any to avoid TypeScript error with mismatched definitions
        setCurrentUser(userProfile as any);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Session initialization error:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, setIsAuthenticated, setCurrentUser]);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          fetchUserProfile(session.user.id).then((profile) => {
            if (profile) {
              // Cast to any to avoid TypeScript error with mismatched definitions
              setCurrentUser(profile as any);
              setIsAuthenticated(true);
            }
          });
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession, fetchUserProfile, setCurrentUser, setIsAuthenticated]);

  return { isLoading, checkSession };
};
