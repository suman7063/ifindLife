
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { secureLogger } from '@/utils/secureLogger';

export const usePasswordManagement = () => {
  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      // Validate password strength before updating
      const validation = validatePasswordStrength(password);
      if (!validation.isValid) {
        toast.error(validation.feedback);
        return false;
      }

      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      secureLogger.error('Password update error:', error);
      toast.error('Failed to update password');
      return false;
    }
  }, []);

  return { updatePassword };
};
