
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { directUserLogin, getRedirectPath } from '@/utils/directAuth';

const UserLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  
  // Check for pending actions in sessionStorage
  useEffect(() => {
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (pendingActionStr) {
      try {
        const action = JSON.parse(pendingActionStr);
        setPendingAction(action);
        console.log("UserLoginContent - Found pending action:", action);
      } catch (error) {
        console.error('Error parsing pending action:', error);
        sessionStorage.removeItem('pendingAction');
      }
    }
  }, []);
  
  // Set login origin to 'user' to ensure correct role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'user');
    console.log('UserLoginContent: Setting login origin to user');
  }, []);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log("Attempting user login with direct method:", email);
      
      // Use direct login method
      const result = await directUserLogin(email, password);
      
      if (!result.success) {
        const errorMessage = result.error?.message || 'Login failed. Please check your credentials.';
        setLoginError(errorMessage);
        toast.error(errorMessage);
        setIsLoggingIn(false);
        return false;
      }
      
      toast.success("Login successful!");
      
      // Allow time for the authentication state to update
      setTimeout(() => {
        const redirectPath = getRedirectPath();
        console.log("Login successful, redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
      setIsLoggingIn(false);
      return false;
    }
  };

  return (
    <div className="w-full">
      {pendingAction && (
        <Alert className="mb-4">
          <AlertDescription>
            After login, you'll be returned to continue your {
              pendingAction.type === 'favorite' ? 'favoriting' : 
              pendingAction.type === 'call' ? 'call' : 
              pendingAction.type === 'book' ? 'booking' : 'previous'
            } action.
          </AlertDescription>
        </Alert>
      )}
      
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      <UserLoginTabs onLogin={handleLogin} isLoggingIn={isLoggingIn} />
    </div>
  );
};

export default UserLoginContent;
