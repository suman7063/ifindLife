
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
        toast.error(`Logout failed: ${error.message}`);
        setLogoutError(error.message);
        return false;
      }

      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(`Logout failed: ${error.message || 'Unknown error'}`);
      setLogoutError(error.message || 'Unknown error');
      return false;
    }
  };

  return {
    logout,
    logoutError
  };
};
