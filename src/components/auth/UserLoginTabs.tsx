
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './LoginTab';
import RegisterTab from './RegisterTab';
import { Link } from 'react-router-dom';

interface UserLoginTabsProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const UserLoginTabs: React.FC<UserLoginTabsProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-6">
        <LoginTab onLogin={onLogin} />
        
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </TabsContent>
      
      <TabsContent value="register" className="mt-6">
        <RegisterTab onSuccess={() => setActiveTab('login')} />
      </TabsContent>
    </Tabs>
  );
};

export default UserLoginTabs;
