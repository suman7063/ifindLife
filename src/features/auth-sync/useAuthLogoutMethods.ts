
import { useCallback } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/lib/supabase';

export const useAuthLogoutMethods = () => {
  const userAuth = useUserAuth();
  
  const userLogout = useCallback(async (): Promise<boolean> => {
    if (userAuth && typeof userAuth.logout === 'function') {
      return await userAuth.logout();
    }
    return false;
  }, [userAuth]);

  const expertLogout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch (error) {
      console.error('Expert logout error:', error);
      return false;
    }
  }, []);

  const fullLogout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      return !error;
    } catch (error) {
      console.error('Full logout error:', error);
      return false;
    }
  }, []);

  return {
    userLogout,
    expertLogout,
    fullLogout
  };
};
