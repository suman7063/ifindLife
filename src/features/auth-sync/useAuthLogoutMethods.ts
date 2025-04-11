
import { useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';

export const useAuthLogoutMethods = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const auth = useUserAuth();
  
  const handleLogout = async () => {
    if (!auth || !auth.logout) return false;
    
    try {
      setIsLoggingOut(true);
      const success = await auth.logout();
      return success;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return {
    isLoggingOut,
    handleLogout
  };
};

export default useAuthLogoutMethods;
