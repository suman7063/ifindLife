
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthLogout = (onActionComplete: () => void) => {
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      localStorage.removeItem('sessionType');
      toast.success('Logged out successfully');
      onActionComplete();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      return false;
    }
  }, [onActionComplete]);

  return { logout };
};
