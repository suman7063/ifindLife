
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
    try {
      console.log('Login function called with email:', email, 'and options:', options);
      
      if (!email || !password) {
        toast.error('Email and password are required');
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error from Supabase:', error);
        
        // Provide more user-friendly error messages based on error code
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before logging in.');
        } else {
          toast.error(error.message || 'Login failed. Please try again.');
        }
        
        return false;
      }

      console.log('Login success, session established:', !!data.session);

      // Set session type based on options
      const sessionType = options?.asExpert ? 'expert' : 'user';
      console.log(`Setting session type to ${sessionType}`);
      localStorage.setItem('sessionType', sessionType);
      
      console.log('Login successful, calling onActionComplete');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  return { login };
};
