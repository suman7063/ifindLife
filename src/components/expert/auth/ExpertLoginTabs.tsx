
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertLoginForm from './ExpertLoginForm';
import ExpertRegisterForm from './ExpertRegisterForm';

interface ExpertLoginTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
}

const ExpertLoginTabs: React.FC<ExpertLoginTabsProps> = ({
  activeTab,
  setActiveTab,
  onLogin,
  isLoggingIn,
  loginError
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <ExpertLoginForm 
          onLogin={onLogin} 
          isLoggingIn={isLoggingIn} 
          loginError={loginError} 
          setActiveTab={setActiveTab} 
        />
      </TabsContent>
      
      <TabsContent value="register">
        <ExpertRegisterForm setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertLoginTabs;
