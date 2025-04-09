
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';

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
      console.log('Initiating userLogout in useAuthLogoutEffects');
      const success = await userLogout();
      
      if (success) {
        console.log('userLogout successful');
        return true;
      } else {
        console.error('userLogout failed');
        toast.error('Failed to log out user account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error in userLogout:', error);
      toast.error('An error occurred during user logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFullLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting full logout...');
      await fullLogout(); // Removed the argument
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
