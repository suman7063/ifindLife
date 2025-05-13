
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

interface UserLoginTabsProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the unified auth context
  const auth = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if onLogin prop is provided (for custom login handling)
      if (onLogin) {
        return await onLogin(email, password);
      } 
      
      // Check if login function is available in auth context
      if (!auth.login || typeof auth.login !== 'function') {
        console.error("Login function is not available in auth context:", auth);
        toast.error('Login functionality is not available. Please try again later.');
        return false;
      }
      
      // Use the auth context login function
      return await auth.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      console.log("Attempting user registration with:", userData.email);
      if (!auth.signup || typeof auth.signup !== 'function') {
        console.error("Signup function is not available in auth context:", auth);
        toast.error('Registration feature is not available. Please try again later.');
        return;
      }
      
      const success = await auth.signup(
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
      
      if (success) {
        toast.success('Registration successful! Please check your email for verification.');
        setActiveTab('login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm 
          onLogin={handleLogin} 
          loading={isLoading || auth.isLoading} 
        />
      </TabsContent>
      
      <TabsContent value="register">
        <RegisterForm 
          onRegister={handleRegister}
          loading={isLoading || auth.isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
