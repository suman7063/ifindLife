
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { handleAuthError } from '@/utils/authUtils';

export const useAuthPassword = (setLoading: (value: boolean) => void) => {
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Failed to send reset instructions');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      handleAuthError(error, 'Failed to update password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, updatePassword };
};
