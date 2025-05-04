
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
        // First, try to get expert profile from 'expert_accounts' table
        const { data: profileData, error: profileError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', userId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw profileError;
        }

        // If no errors and data found, set expert profile
        setExpertProfile(profileData);
      } catch (err) {
        console.error('Error fetching expert profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchExpertProfile();
  }, [userId, session]);

  return { expertProfile, loading, error };
};
