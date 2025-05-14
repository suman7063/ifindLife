
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthPassword = (
  setLoading: (loading: boolean) => void
) => {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setPasswordError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error.message);
        toast.error(`Password reset failed: ${error.message}`);
        setPasswordError(error.message);
        return false;
      }

      toast.success('Password reset email sent');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(`Password reset failed: ${error.message || 'Unknown error'}`);
      setPasswordError(error.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      setPasswordError(null);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Password update error:', error.message);
        toast.error(`Password update failed: ${error.message}`);
        setPasswordError(error.message);
        return false;
      }

      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(`Password update failed: ${error.message || 'Unknown error'}`);
      setPasswordError(error.message || 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    updatePassword,
    passwordError,
  };
};
