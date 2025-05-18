
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthLogout = () => {
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Logging out user');
      
      // Get the current session type for appropriate redirect
      const sessionType = localStorage.getItem('sessionType') || 'user';
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message || 'Failed to log out');
        return false;
      }
      
      // Clear local storage
      localStorage.removeItem('sessionType');
      
      // Show success message
      toast.success('Successfully logged out');
      
      // Redirect to logout confirmation
      window.location.href = `/logout?type=${sessionType}`;
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
      return false;
    }
  }, []);

  return { logout };
};
