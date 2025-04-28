
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './LoginTab';
import RegisterTab from './RegisterTab';

interface UserLoginTabsProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset errors on tab change
    setLoginError(null);
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
        <RegisterTab />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
