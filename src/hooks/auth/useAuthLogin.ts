
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuthLogin = (
  setLoading: (value: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return false;
      }

      if (data.session) {
        setSession(data.session);
        return true;
      }
      
      toast.error('Login failed. Please try again.');
      return false;
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      toast.error(error.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, error };
};

export default useAuthLogin;
