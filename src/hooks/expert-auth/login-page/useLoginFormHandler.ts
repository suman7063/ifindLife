
import { useState } from 'react';
import { toast } from 'sonner';
import { useExpertAuth } from '../useExpertAuth';
import { UserProfile } from '@/types/supabase';

export const useLoginFormHandler = (userProfile: UserProfile | null) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, hasUserAccount } = useExpertAuth();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingIn) return false;
    
    if (!email.trim()) {
      setLoginError('Email is required');
      return false;
    }
    
    if (!password.trim()) {
      setLoginError('Password is required');
      return false;
    }
    
    if (userProfile) {
      setLoginError('Please log out as a user before attempting to log in as an expert');
      return false;
    }
    
    const hasUserAcct = await hasUserAccount(email);
    if (hasUserAcct) {
      setLoginError('This email is registered as a user. Please use a different email for expert login.');
      return false;
    }
    
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      console.log('Expert auth: Starting login process for', email);
      
      const success = await login(email, password);
      
      if (!success) {
        // Login error is handled in the useExpertAuthentication hook with toast messages
        setLoginError('Login failed. Please check your credentials and try again.');
      } else {
        console.log('Expert login successful');
        toast.success('Login successful! Redirecting to dashboard...');
        // No need to use setTimeout - the useEffect will handle redirection
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  return { isLoggingIn, loginError, handleLogin };
};
