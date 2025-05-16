
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LoginOptions } from '@/contexts/auth/types';
import { logFunctionError } from '@/utils/errorLogger';

export const useAuthLogin = (state: any, onActionComplete: () => void) => {
  const login = useCallback(async (
    email: string, 
    password: string, 
    options?: LoginOptions
  ): Promise<boolean> => {
    console.log('Login function called with email:', email, 'and options:', options);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error from Supabase:', error);
        toast.error(error.message);
        return false;
      }

      console.log('Login success, session established:', !!data.session);

      // Use options.asExpert if provided, otherwise default to 'user'
      if (options?.asExpert) {
        console.log('Setting session type to expert based on options');
        localStorage.setItem('sessionType', 'expert');
      } else {
        console.log('Setting session type to user (default)');
        localStorage.setItem('sessionType', 'user');
      }
      
      console.log('Login successful, calling onActionComplete');
      onActionComplete();
      return true;
    } catch (error) {
      logFunctionError('login', error);
      toast.error('Failed to login. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  // Log at hook level to verify login function is created
  console.log('useAuthLogin hook: created login function of type:', typeof login);

  return { login };
};
