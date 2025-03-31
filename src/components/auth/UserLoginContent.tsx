
import React from 'react';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import UserLoginTabs from '@/components/auth/UserLoginTabs';

const UserLoginContent = () => {
  const { 
    isExpertAuthenticated, 
    expertProfile,
    expertLogout,
    isLoggingOut,
    setIsLoggingOut
  } = useAuthSynchronization();
  
  const handleExpertLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      const success = await expertLogout();
      
      if (success) {
        // Force a full page reload to ensure clean state
        window.location.href = '/user-login';
        return true;
      } else {
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.href = '/user-login';
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.href = '/user-login';
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <>
      {isExpertAuthenticated ? (
        <UserLogoutAlert 
          profileName={expertProfile?.name}
          isLoggingOut={isLoggingOut}
          onLogout={handleExpertLogout}
        />
      ) : (
        <UserLoginTabs />
      )}
    </>
  );
};

export default UserLoginContent;
