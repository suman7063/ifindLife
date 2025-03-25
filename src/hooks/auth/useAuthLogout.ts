
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { handleAuthError } from '@/utils/authUtils';

export const useAuthLogout = (setLoading: (value: boolean) => void) => {
  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Logout failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
