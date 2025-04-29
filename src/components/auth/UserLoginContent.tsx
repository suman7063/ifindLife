
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const UserLoginContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Use the unified auth context
  const { 
    login,
    isAuthenticated,
    isLoading,
    role
  } = useAuth();
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log("Attempting user login with:", email);
      
      if (!login || typeof login !== 'function') {
        console.error("Login function is not available:", login);
        toast.error("Login functionality is not available");
        setIsLoggingIn(false);
        return false;
      }
      
      const success = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        // Redirect to the appropriate dashboard based on role
        if (role === 'user') {
          navigate('/user-dashboard');
        } else if (role === 'expert') {
          navigate('/expert-dashboard');
        } else if (role === 'admin') {
          navigate('/admin');
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
    }
  };

  return (
    <div>
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
