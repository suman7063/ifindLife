
import React, { useEffect } from 'react';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import UserLogoutAlert from '@/components/auth/UserLogoutAlert';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const UserLoginContent = () => {
  const { 
    isExpertAuthenticated, 
    expertProfile,
    expertLogout,
    isLoggingOut,
    setIsLoggingOut,
    authCheckCompleted,
    hasDualSessions,
    fullLogout,
    sessionType
  } = useAuthSynchronization();
  
  const handleExpertLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      const success = await expertLogout();
      
      if (success) {
        // Navigation handled by the logout function
        return true;
      } else {
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleFullLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      const success = await fullLogout();
      
      if (success) {
        // Navigation handled by the logout function
        return true;
      } else {
        // Force a page reload as a last resort
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return false;
      }
    } catch (error) {
      console.error('Error during full logout:', error);
      
      // Force a page reload as a last resort
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <>
      {hasDualSessions ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Multiple Sessions Detected</AlertTitle>
            <AlertDescription>
              You are currently logged in as both a user and an expert. This can cause authentication issues.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleFullLogout} 
            variant="destructive" 
            className="w-full"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Logging Out...
              </>
            ) : 'Log Out of All Accounts'}
          </Button>
        </div>
      ) : authCheckCompleted && (sessionType === 'expert' || isExpertAuthenticated) ? (
        <UserLogoutAlert 
          profileName={expertProfile?.name}
          isLoggingOut={isLoggingOut}
          onLogout={handleExpertLogout}
          logoutType="expert"
        />
      ) : (
        <UserLoginTabs />
      )}
    </>
  );
};

export default UserLoginContent;
