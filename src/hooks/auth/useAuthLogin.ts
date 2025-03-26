
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
      console.log("Attempting login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        // Throw the error so it can be caught and handled by the caller
        throw error;
      }

      if (data.user && data.session) {
        console.log("Login successful, user:", data.user.email);
        setSession(data.session);
        toast.success(`Welcome back, ${data.user.email}!`);
        return true;
      }
      
      console.log("No user returned from login attempt");
      toast.error("Login failed. Please try again.");
      return false;
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      handleAuthError(error, 'Login failed');
      throw error; // Rethrow the error to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
