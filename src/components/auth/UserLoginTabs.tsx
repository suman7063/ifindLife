
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './LoginTab';
import RegisterTab from './RegisterTab';

interface UserLoginTabsProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin, isLoggingIn }) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="space-y-4 mt-6">
        <LoginTab 
          onLogin={onLogin} 
          isLoggingIn={isLoggingIn}
          onSwitchToRegister={() => setActiveTab('register')}
        />
      </TabsContent>
      
      <TabsContent value="register" className="space-y-4 mt-6">
        <RegisterTab onSwitchToLogin={() => setActiveTab('login')} />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
