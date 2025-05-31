
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';

export const useAuthLogout = () => {
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setLogoutError(null);

      // Clear any stored login origin
      sessionStorage.removeItem('loginOrigin');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
        showLogoutErrorToast();
        setLogoutError(error.message);
        return false;
      }

      showLogoutSuccessToast();
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      showLogoutErrorToast();
      setLogoutError(error.message || 'Unknown error');
      return false;
    }
  };

  return {
    logout,
    logoutError
  };
};
