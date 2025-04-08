
import { useState, useEffect } from 'react';
import { useExpertAuth } from './useExpertAuth';
import { useUserAuth } from '@/contexts/UserAuthContext';

export const useExpertLoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [userProfile, setUserProfile] = useState(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expert, setExpert] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [userHasAccount, setUserHasAccount] = useState(false);
  
  const { login, hasUserAccount, initialized: authInitialized, loading, currentExpert } = useExpertAuth();
  const { currentUser } = useUserAuth();
  
  useEffect(() => {
    if (window.location.search.includes('status=registered')) {
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Please log in to continue.'
      });
    }
  }, []);
  
  useEffect(() => {
    setInitialized(authInitialized);
  }, [authInitialized]);
  
  useEffect(() => {
    setExpert(currentExpert);
  }, [currentExpert]);
  
  useEffect(() => {
    setUserProfile(currentUser);
  }, [currentUser]);

  useEffect(() => {
    // Make this an async function and immediately invoke it
    const checkUserAccount = async () => {
      if (initialized && !isLoggingIn) {
        console.log('Checking user...');
        setIsCheckingUser(true);
        // Call without unnecessary parameter
        const hasUser = await hasUserAccount();
        setUserHasAccount(hasUser);
        setIsCheckingUser(false);
      }
    };
    
    checkUserAccount();
  }, [initialized, isLoggingIn, hasUserAccount]);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
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
    isLoggingIn,
    loginError,
    activeTab,
    setActiveTab,
    userProfile,
    statusMessage,
    expert,
    loading,
    initialized,
    isCheckingUser,
    handleLogin
  };
};
