
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { handleAuthError } from '@/utils/authUtils';

export const useAuthLogin = (
  setLoading: (value: boolean) => void,
  setSession: (session: Session | null) => void
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success(`Welcome back, ${data.user.email}!`);
        return true;
      }
      return false;
    } catch (error: any) {
      handleAuthError(error, 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
