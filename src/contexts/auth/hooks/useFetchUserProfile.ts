
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const useFetchUserProfile = (userId: string | undefined, session: Session | null) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !session) {
        setLoading(false);
        return;
      }

      try {
        // First, try to get user profile from 'users' table
        let { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError || !profileData) {
          // If no profile found in 'users' table, try 'profiles' table
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (fallbackError && fallbackError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            throw fallbackError;
          }

          if (fallbackData) {
            profileData = fallbackData;
          }
        }

        setUserProfile(profileData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, session]);

  return { userProfile, loading, error };
};
