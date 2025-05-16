
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { directUserLogin } from '@/utils/directAuth';

const UserLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  
  // Use the unified auth context as a fallback
  const auth = useAuth();
  
  // Check for pending actions in sessionStorage
  useEffect(() => {
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (pendingActionStr) {
      try {
        const action = JSON.parse(pendingActionStr);
        setPendingAction(action);
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
      
      // The redirect is handled in the directUserLogin function
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
            After login, you'll be returned to continue your {pendingAction.type === 'favorite' ? 'favoriting' : pendingAction.type === 'call' ? 'call' : 'booking'} action.
          </AlertDescription>
        </Alert>
      )}
      
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      <UserLoginTabs onLogin={handleLogin} />
    </div>
  );
};

export default UserLoginContent;
