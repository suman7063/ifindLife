
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './LoginTab';
import RegisterTab from './RegisterTab';
import { Link } from 'react-router-dom';
import { ReferralSettings } from '@/types/supabase';

interface UserLoginTabsProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn?: boolean;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin, isLoggingIn = false }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Wrapper for the login function to handle loading state
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await onLogin(email, password);
      if (!success) {
        setLoginError('Login failed. Please check your credentials.');
      }
      return success;
    } catch (error) {
      setLoginError('An unexpected error occurred.');
      return false;
    }
  };
  
  // Function for RegisterTab that matches its expected props
  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }): Promise<boolean> => {
    try {
      setIsRegistering(true);
      setRegisterError(null);
      
      // This would typically connect to your registration service
      console.log('Registration data:', userData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful registration, switch to login tab
      setActiveTab('login');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Registration failed. Please try again.');
      return false;
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-6">
        <LoginTab 
          onLogin={handleLogin}
          loading={false}
          isLoggingIn={isLoggingIn}
          loginError={loginError}
          socialLoading={socialLoading}
          authLoading={false}
          setSocialLoading={setSocialLoading}
        />
        
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </TabsContent>
      
      <TabsContent value="register" className="mt-6">
        <RegisterTab 
          onRegister={handleRegister}
          loading={false}
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
