
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger 
          value="login" 
          className="py-3 text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="register" 
          className="py-3 text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Register
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-6">
        <ExpertLoginForm 
          onLogin={onLogin} 
          isLoggingIn={isLoggingIn} 
          loginError={loginError} 
          setActiveTab={setActiveTab} 
        />
      </TabsContent>
      
      <TabsContent value="register" className="mt-6">
        <ExpertRegisterForm setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertLoginTabs;
