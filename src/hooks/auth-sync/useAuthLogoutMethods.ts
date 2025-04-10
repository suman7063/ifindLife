
import { useCallback } from 'react';
import { toast } from 'sonner';
import { SessionType } from './types';

export const useAuthLogoutMethods = (
  userLogoutFn: () => Promise<boolean>, 
  expertLogoutFn: () => Promise<boolean>,
  setLoggingOut: (value: boolean) => void
) => {
  // Log out from user account
  const userLogout = useCallback(async (): Promise<boolean> => {
    try {
      setLoggingOut(true);
      const success = await userLogoutFn();
      if (!success) {
        toast.error('User logout failed');
      }
      return success;
    } catch (error) {
      console.error('[AuthSync] User logout error:', error);
      toast.error('User logout failed');
      return false;
    } finally {
      setLoggingOut(false);
    }
  }, [userLogoutFn, setLoggingOut]);

  // Log out from expert account
  const expertLogout = useCallback(async (): Promise<boolean> => {
    try {
      setLoggingOut(true);
      const success = await expertLogoutFn();
      if (!success) {
        toast.error('Expert logout failed');
      }
      return success;
    } catch (error) {
      console.error('[AuthSync] Expert logout error:', error);
      toast.error('Expert logout failed');
      return false;
    } finally {
      setLoggingOut(false);
    }
  }, [expertLogoutFn, setLoggingOut]);

  // Log out from all accounts
  const fullLogout = useCallback(async (): Promise<boolean> => {
    try {
      setLoggingOut(true);
      let userSuccess = true;
      let expertSuccess = true;
      
      // Try to logout from both accounts
      userSuccess = await userLogoutFn().catch(() => false);
      expertSuccess = await expertLogoutFn().catch(() => false);
      
      if (!userSuccess && !expertSuccess) {
        toast.error('Logout failed');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[AuthSync] Full logout error:', error);
      toast.error('Logout failed');
      return false;
    } finally {
      setLoggingOut(false);
    }
  }, [userLogoutFn, expertLogoutFn, setLoggingOut]);

  return {
    userLogout,
    expertLogout,
    fullLogout
  };
};
