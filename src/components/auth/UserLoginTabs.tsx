
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from '@/components/auth/LoginTab';
import RegisterTab from '@/components/auth/RegisterTab';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const UserLoginTabs = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [socialLoginLoading, setSocialLoginLoading] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const location = useLocation();
  const { redirectIfAuthenticated } = useAuthRedirect('/user-dashboard');
  
  // Get auth state from context
  const { login, signup, authLoading, isAuthenticated, currentUser } = useUserAuth();
  
  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser && !authLoading) {
      console.log('UserLoginTabs: User authenticated, redirecting');
      redirectIfAuthenticated();
    }
  }, [isAuthenticated, currentUser, authLoading, redirectIfAuthenticated]);
  
  // Check if redirected to register tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      console.log('Attempting user login with:', email);
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful! Redirecting to dashboard...');
        // Let the useEffect handle redirection to avoid race conditions
      } else {
        setLoginError('Login failed. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }): Promise<void> => {
    if (isRegistering) return;
    
    setIsRegistering(true);
    setRegisterError(null);
    
    try {
      console.log('Attempting user registration with:', userData.email);
      const success = await signup(
        userData.email, 
        userData.password, 
        {
          name: userData.name,
          phone: userData.phone,
          country: userData.country,
          city: userData.city
        }, 
        userData.referralCode
      );
      
      if (!success) {
        setRegisterError('Registration failed. Please try again.');
      } else {
        console.log('User registration successful');
        toast.success('Registration successful! Please check your email for verification.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterError(error.message || 'An unexpected error occurred');
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginTab 
          onLogin={handleLogin} 
          loading={authLoading}
          isLoggingIn={isLoggingIn}
          loginError={loginError}
          socialLoading={socialLoginLoading}
          authLoading={authLoading}
          setSocialLoading={(provider) => setSocialLoginLoading(provider)}
        />
      </TabsContent>
      
      <TabsContent value="register">
        <RegisterTab 
          onRegister={handleRegister}
          loading={authLoading}
          isRegistering={isRegistering}
          registerError={registerError}
          initialReferralCode={null}
          referralSettings={null}
          setCaptchaVerified={() => {}}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
