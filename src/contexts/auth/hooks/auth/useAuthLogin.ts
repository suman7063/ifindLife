
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LoginOptions } from '@/contexts/auth/types';

export const useAuthLogin = (state: any, onActionComplete: () => void) => {
  const login = useCallback(async (
    email: string, 
    password: string, 
    options?: LoginOptions
  ): Promise<boolean> => {
    console.log('Login function called with email:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      // Use options.asExpert if provided, otherwise default to false
      if (options?.asExpert) {
        localStorage.setItem('sessionType', 'expert');
      } else {
        localStorage.setItem('sessionType', 'user');
      }
      
      console.log('Login successful, calling onActionComplete');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  // Log at hook level to verify login function is created
  console.log('useAuthLogin hook: created login function of type:', typeof login);

  return { login };
};
