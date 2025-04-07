
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { UserProfile } from '@/types/supabase';

export const useAuthLogoutEffects = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { 
    isSynchronizing, 
    userLogout, 
    isLoggingOut: syncLoggingOut,
    setIsLoggingOut: setSyncLoggingOut,
    authCheckCompleted,
    hasDualSessions,
    fullLogout,
    sessionType,
    isAuthenticated
  } = useAuthSynchronization();
  
  const handleUserLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting to log out user...');
      const success = await userLogout();
      
      if (success) {
        console.log('User logout completed');
        return true;
      } else {
        console.error('User logout failed');
        window.location.reload();
        return false;
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      window.location.reload();
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFullLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting full logout...');
      await fullLogout();
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return {
    isSynchronizing,
    isLoggingOut: isLoggingOut || syncLoggingOut,
    setIsLoggingOut: (value: boolean) => {
      setIsLoggingOut(value);
      setSyncLoggingOut(value);
    },
    authCheckCompleted,
    hasDualSessions,
    sessionType,
    isAuthenticated,
    handleUserLogout,
    handleFullLogout
  };
};
