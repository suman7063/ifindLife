
// Fix the login handler to match the expected function signature
import { useState } from 'react';
import { useExpertAuth } from '../useExpertAuth';

export const useLoginFormHandler = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { login } = useExpertAuth();
  
  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return false;
    }
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      // Update to match expected function signature
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Login failed. Please check your credentials.');
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoggingIn,
    loginError,
    handleLogin
  };
};
