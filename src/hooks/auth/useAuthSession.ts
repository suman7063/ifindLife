
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const useAuthSession = (
  setLoading: (value: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const [error, setError] = useState<string | null>(null);

  const getSession = async (): Promise<Session | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        return null;
      }
      
      setSession(data.session);
      return data.session;
    } catch (error: any) {
      setError(error.message || 'An error occurred while getting the session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSession, error };
};

export default useAuthSession;
