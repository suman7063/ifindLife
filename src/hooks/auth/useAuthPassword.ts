
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthPassword = (setLoading: (value: boolean) => void) => {
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred while requesting password reset');
      toast.error(error.message || 'An error occurred while requesting password reset');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating password');
      toast.error(error.message || 'An error occurred while updating password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, updatePassword, error };
};

export default useAuthPassword;
