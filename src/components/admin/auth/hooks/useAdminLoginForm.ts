
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
    
    // Debug logs
    console.log('Admin login form submitted with username:', username);
    console.log('Available login methods:', {
      propLogin: !!onLogin
    });
    
    try {
      setIsSubmitting(true);
      
      // Debug the credentials being used
      setDebugInfo(`Attempting login with username: "${username}" and password: "${password}"`);
      
      // Try to use the provided login function
      if (typeof onLogin === 'function') {
        console.log(`Trying onLogin with username: "${username}" and password length: ${password.length}`);
        
        // For debugging - show expected password for IFLsuperadmin
        const normalizedUsername = username.toLowerCase();
        if (normalizedUsername === 'iflsuperadmin') {
          const expectedPassword = testCredentials.iflsuperadmin.password;
          console.log(`DEBUG - Expected password for ${normalizedUsername}: "${expectedPassword}"`);
          console.log(`DEBUG - Password match: ${password === expectedPassword ? 'YES' : 'NO'}`);
        }
        
        const success = await onLogin(username, password);
        console.log('Using provided login function, result:', success);
        
        if (success) {
          onLoginSuccess();
          return;
        } else {
          // Login failed - show error with helpful information
          setErrorMessage('Login failed. Please check your credentials. Only IFLsuperadmin can log in.');
          
          // Add more helpful debug info
          const normalizedUsername = username.toLowerCase();
          if (normalizedUsername === 'iflsuperadmin') {
            setDebugInfo(`For IFLsuperadmin, try the password: "${testCredentials.iflsuperadmin.password}"`);
          } else {
            setDebugInfo('Only IFLsuperadmin is allowed to log in.');
          }
        }
      } else {
        console.error('No login function available');
        setErrorMessage('Authentication service is not available');
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
