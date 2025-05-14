
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuthLogin = (
  setLoading: (loading: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = async (email: string, password: string, loginAs?: 'user' | 'expert') => {
    try {
      setLoading(true);
      setLoginError(null);

      // Store login origin for role determination
      if (loginAs) {
        sessionStorage.setItem('loginOrigin', loginAs);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(`Login failed: ${error.message}`);
        setLoginError(error.message);
        return false;
      }

      // Set the session
      setSession(data.session);
      toast.success('Login successful');
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message || 'Unknown error'}`);
      setLoginError(error.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loginError
  };
};
