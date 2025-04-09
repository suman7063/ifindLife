
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export const useAuthSession = (
  setLoading: (value: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const getSession = async (): Promise<Session | null> => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSession };
};

export default useAuthSession;
