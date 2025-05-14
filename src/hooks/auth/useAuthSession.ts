
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const useAuthSession = (
  setLoading: (loading: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const getSession = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        return null;
      }
      
      // Set session state
      setSession(data.session);
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSession]);

  return {
    getSession
  };
};
