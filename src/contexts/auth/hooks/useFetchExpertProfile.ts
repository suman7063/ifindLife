
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const useFetchExpertProfile = (userId: string | undefined, session: Session | null) => {
  const [expertProfile, setExpertProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpertProfile = async () => {
      if (!userId || !session) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to fetch expert profile from 'expert_accounts' table
        console.log(`Attempting to fetch expert profile for user ID: ${userId}`);
        const { data: profileData, error: profileError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', userId)
          .maybeSingle();

        // Handle specific error cases
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // "No rows returned" is not a critical error, just means the user is not an expert
            console.log('No expert profile found for this user');
            setExpertProfile(null);
          } else {
            // For any other errors, log them but don't throw an exception
            console.error('Error fetching expert profile:', profileError);
            setError(profileError);
          }
        } else if (profileData) {
          console.log('Expert profile found:', profileData);
          setExpertProfile(profileData);
        }
      } catch (err) {
        console.error('Error in fetchExpertProfile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // We're setting expert profile to null even on error to prevent UI blocking
        setExpertProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertProfile();
  }, [userId, session]);

  return { expertProfile, loading, error };
};
