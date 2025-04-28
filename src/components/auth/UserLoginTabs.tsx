
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './LoginTab';
import RegisterTab from './RegisterTab';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ReferralSettings } from '@/types/supabase';

interface UserLoginTabsProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { register } = useAuth();
  
  // Mock referral settings for the RegisterTab
  const referralSettings: ReferralSettings | null = {
    enabled: false,
    bonus_amount: 0,
    minimum_withdrawal: 0
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset errors on tab change
    setLoginError(null);
    setRegisterError(null);
  };
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    if (!onLogin) {
      console.error("Login function not provided to UserLoginTabs");
      setLoginError("Unable to process login. Please try again later.");
      return false;
    }
    
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const success = await onLogin(email, password);
      if (!success) {
        setLoginError("Login failed. Please check your credentials.");
      }
      return success;
    } catch (error: any) {
      console.error("Login error in UserLoginTabs:", error);
      setLoginError(error.message || "An error occurred during login");
      return false;
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
    setIsRegistering(true);
    setRegisterError(null);
    
    try {
      if (register) {
        await register(userData);
        // Registration successful, switch to login tab
        setActiveTab('login');
      } else {
        setRegisterError("Registration function not available");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegisterError(error.message || "An error occurred during registration");
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginTab
          onLogin={handleLogin}
          loading={false}
          isLoggingIn={isLoggingIn}
          loginError={loginError}
          socialLoading={socialLoading}
          authLoading={false}
          setSocialLoading={setSocialLoading}
        />
      </TabsContent>
      
      <TabsContent value="register">
        <RegisterTab 
          onRegister={handleRegister}
          loading={false}
          isRegistering={isRegistering}
          registerError={registerError}
          initialReferralCode={null}
          referralSettings={referralSettings}
          setCaptchaVerified={() => setCaptchaVerified(true)}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
