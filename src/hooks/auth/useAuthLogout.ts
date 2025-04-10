
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthLogout = (setLoading: (value: boolean) => void) => {
  const [error, setError] = useState<string | null>(null);

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred during logout');
      toast.error(error.message || 'An error occurred during logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout, error };
};

export default useAuthLogout;
