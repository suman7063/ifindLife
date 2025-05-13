
import { useCallback } from 'react';
import { UserProfile } from '@/types/supabase';
import { AuthContextType } from '@/contexts/auth/AuthContext';

export const useAuthBackCompat = (auth: AuthContextType) => {
  // Convert any boolean returns to match required format with error property
  const logoutWithErrorProp = useCallback(async () => {
    try {
      const result = await auth.logout();
      if (typeof result === 'boolean') {
        return { error: result ? null : new Error('Logout failed') };
      }
      return result;
    } catch (error: any) {
      return { error };
    }
  }, [auth.logout]);

  // Special case for specific functions that need Promise<boolean> return type
  const hasTakenServiceFromAsync = useCallback(
    async (expertId: number): Promise<boolean> => {
      if (!auth.hasTakenServiceFrom) return false;
      try {
        return await auth.hasTakenServiceFrom(expertId);
      } catch (error) {
        console.error('Error in hasTakenServiceFrom:', error);
        return false;
      }
    },
    [auth.hasTakenServiceFrom]
  );

  // Add wrapper for resetPassword to handle error format consistently
  const resetPasswordWithErrorProp = useCallback(
    async (email: string) => {
      try {
        const result = await auth.resetPassword(email);
        if (typeof result === 'boolean') {
          return { error: result ? null : new Error('Reset password failed') };
        }
        return result;
      } catch (error: any) {
        return { error };
      }
    },
    [auth.resetPassword]
  );

  return {
    ...auth,
    logout: logoutWithErrorProp,
    hasTakenServiceFrom: hasTakenServiceFromAsync,
    resetPassword: resetPasswordWithErrorProp
  };
};
