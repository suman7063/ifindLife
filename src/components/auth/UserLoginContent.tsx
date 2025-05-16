
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
  
  // Detailed inspection logs
  useEffect(() => {
    console.log('UserLoginContent: Auth context check:', {
      authAvailable: !!auth,
      loginAvailable: !!auth?.login,
      loginType: typeof auth?.login,
      authKeys: auth ? Object.keys(auth) : []
    });
    
    // Log more detailed structure
    console.log('Auth object keys:', Object.keys(auth || {}));
    console.log('Auth object structure:', JSON.stringify(auth, (key, value) => 
      typeof value === 'function' ? 'FUNCTION' : value, 2));
    
    // Check if login function exists
    if (typeof auth?.login !== 'function') {
      console.warn('Login function is not available in auth context');
      
      // Find any function in auth object that might be used for login
      if (auth) {
        const authFunctions = Object.entries(auth)
          .filter(([_, val]) => typeof val === 'function')
          .map(([key, _]) => key);
        
        console.log('All functions in auth object:', authFunctions);
      }
    }
  }, [auth]);
  
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
      console.log("Attempting user login with:", email);
      console.log("Auth object available:", auth);
      
      if (!auth) {
        console.error("Auth context is not available");
        setLoginError("Authentication system is not available. Please try again later.");
        return false;
      }
      
      // Check if login function exists directly in auth object
      let loginFunction = auth.login;
      
      // If not, look for it in another property
      if (typeof loginFunction !== 'function') {
        console.warn("Direct login function not available, checking for alternatives");
        
        // Try to find any function that might be the login function
        const authFunctions = Object.entries(auth)
          .filter(([_, val]) => typeof val === 'function')
          .map(([key, val]) => ({ key, val }));
          
        console.log("Available functions:", authFunctions.map(f => f.key));
        
        // Try to use any function with "login" in its name
        const loginFunctions = authFunctions.filter(f => 
          f.key.toLowerCase().includes('login') || 
          f.key.toLowerCase().includes('signin')
        );
        
        if (loginFunctions.length > 0) {
          console.log("Found potential login function:", loginFunctions[0].key);
          loginFunction = loginFunctions[0].val;
        }
      }
      
      if (typeof loginFunction !== 'function') {
        console.error("Login function is not available:", typeof loginFunction);
        console.error("Auth keys available:", Object.keys(auth));
        setLoginError("Login functionality is not available. Please try again later.");
        return false;
      }
      
      // Call the login function from auth context
      const success = await loginFunction(email, password);
      
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
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
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
