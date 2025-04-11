
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SessionType } from './types';

export const useAuthLogoutMethods = (
  sessionType: SessionType, 
  setIsUserAuthenticated: (value: boolean) => void,
  setIsExpertAuthenticated: (value: boolean) => void,
  setSessionType: (value: SessionType) => void,
  setHasDualSessions: (value: boolean) => void,
  setIsLoggingOut: (value: boolean) => void
) => {
  // User logout function
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting user logout');
      // Sign out from Supabase using local scope
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error('Error during user logout:', error);
        toast.error('Failed to log out as user: ' + error.message);
        return false;
      }
      
      setIsUserAuthenticated(false);
      if (sessionType === 'dual') {
        setSessionType('expert');
      } else {
        setSessionType('none');
      }
      setHasDualSessions(false);
      toast.success('Successfully logged out as user');
      
      return true;
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [sessionType, setIsUserAuthenticated, setSessionType, setHasDualSessions, setIsLoggingOut]);
  
  // Expert logout function
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting expert logout');
      // Sign out from Supabase using local scope
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error('Error during expert logout:', error);
        toast.error('Failed to log out as expert: ' + error.message);
        return false;
      }
      
      setIsExpertAuthenticated(false);
      if (sessionType === 'dual') {
        setSessionType('user');
      } else {
        setSessionType('none');
      }
      setHasDualSessions(false);
      toast.success('Successfully logged out as expert');
      
      return true;
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [sessionType, setIsExpertAuthenticated, setSessionType, setHasDualSessions, setIsLoggingOut]);
  
  // Full logout function (both user and expert)
  const fullLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting full logout');
      
      // Sign out from Supabase completely
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Error during full logout:', error);
        toast.error('Failed to log out: ' + error.message);
        return false;
      }
      
      // Clear any local storage related to authentication
      localStorage.removeItem('expertProfile');
      
      // Update state
      setIsUserAuthenticated(false);
      setIsExpertAuthenticated(false);
      setHasDualSessions(false);
      setSessionType('none');
      
      toast.success('Successfully logged out of all accounts');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [setIsUserAuthenticated, setIsExpertAuthenticated, setHasDualSessions, setSessionType, setIsLoggingOut]);

  return { userLogout, expertLogout, fullLogout };
};
