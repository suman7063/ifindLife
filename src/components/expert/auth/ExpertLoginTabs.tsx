
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertLoginForm from './ExpertLoginForm';
import ExpertRegistrationForm from '@/components/expert/ExpertRegistrationForm';

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
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Join as Expert</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <ExpertLoginForm 
          onLogin={onLogin}
          isLoggingIn={isLoggingIn}
          loginError={loginError}
          setActiveTab={setActiveTab}
        />
      </TabsContent>
      
      <TabsContent value="register" className="max-h-[70vh] overflow-y-auto pb-8">
        <ExpertRegistrationForm />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertLoginTabs;
