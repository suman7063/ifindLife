
import { useState, useEffect } from 'react';
import { testCredentials } from '@/contexts/admin-auth/constants';

interface UseAdminLoginFormProps {
  onLogin?: (username: string, password: string) => Promise<boolean>;
  onLoginSuccess: () => void;
}

export const useAdminLoginForm = ({ onLogin, onLoginSuccess }: UseAdminLoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear error message when user changes inputs
    if (errorMessage) {
      setErrorMessage(null);
      setDebugInfo(null);
    }
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDebugInfo(null);
    
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    console.log('Admin login form submitted with:', { username, passwordLength: password.length });
    
    try {
      setIsSubmitting(true);
      
      // Normalize username for comparison
      const normalizedUsername = username.trim().toLowerCase();
      const expectedUsername = testCredentials.iflsuperadmin.username.toLowerCase();
      const expectedPassword = testCredentials.iflsuperadmin.password;
      
      console.log('Credential check:', {
        provided: { username: normalizedUsername, password },
        expected: { username: expectedUsername, password: expectedPassword },
        usernameMatch: normalizedUsername === expectedUsername,
        passwordMatch: password === expectedPassword
      });
      
      // Check credentials locally first
      if (normalizedUsername !== expectedUsername) {
        setErrorMessage('Invalid username. Only IFLsuperadmin can log in.');
        setDebugInfo(`Expected username: ${testCredentials.iflsuperadmin.username}`);
        return;
      }
      
      if (password !== expectedPassword) {
        setErrorMessage('Invalid password. Please check your credentials.');
        setDebugInfo(`Expected password: ${expectedPassword}`);
        return;
      }
      
      // Try to use the provided login function
      if (typeof onLogin === 'function') {
        console.log('Calling onLogin function with validated credentials');
        
        const success = await onLogin(username, password);
        console.log('Login function result:', success);
        
        if (success) {
          console.log('Login successful, calling onLoginSuccess');
          onLoginSuccess();
          return;
        } else {
          setErrorMessage('Login failed. Please try again.');
          setDebugInfo('The login function returned false despite valid credentials.');
        }
      } else {
        console.error('No login function available');
        setErrorMessage('Authentication service is not available');
        setDebugInfo('onLogin function is not provided or is not a function');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
      setDebugInfo(`Error details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errorMessage,
    debugInfo,
    isSubmitting,
    handleSubmit
  };
};
