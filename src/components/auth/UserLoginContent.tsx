
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';

const UserLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  
  // Use the unified auth context
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
  
  // CRITICAL FIX: Set login origin to 'user' to ensure correct role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'user');
    console.log('UserLoginContent: Setting login origin to user');
  }, []);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log("Attempting user login with:", email);
      console.log("Auth object available:", auth);
      
      if (!auth || !auth.login || typeof auth.login !== 'function') {
        console.error("Login function is not available:", auth?.login);
        toast.error("Login functionality is not available");
        setLoginError("Login functionality is not available. Please try again later.");
        setIsLoggingIn(false);
        return false;
      }
      
      // Note: Use 'user' role to explicitly indicate this is a user login
      const success = await auth.login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        
        // Handle redirect based on pending action or role
        if (pendingAction) {
          // Let the auth journey preservation hook handle the redirect
          return true;
        } else {
          // Redirect to the appropriate dashboard based on role
          if (auth.role === 'user') {
            navigate('/user-dashboard');
          } else if (auth.role === 'expert') {
            navigate('/expert-dashboard');
          } else if (auth.role === 'admin') {
            navigate('/admin');
          }
        }
        return true;
      } else {
        setLoginError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
        setIsLoggingIn(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
      setIsLoggingIn(false);
      return false;
    } finally {
      setIsLoggingIn(false);
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
