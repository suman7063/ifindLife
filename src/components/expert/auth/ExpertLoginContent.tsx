
import React from 'react';
import ExpertLoginHeader from './ExpertLoginHeader';
import ExpertLoginTabs from './ExpertLoginTabs';

interface ExpertLoginContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLoggingIn: boolean;
  loginError: string | null;
}

const ExpertLoginContent: React.FC<ExpertLoginContentProps> = ({
  activeTab,
  setActiveTab,
  onLogin,
  isLoggingIn,
  loginError
}) => {
  return (
    <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-astro-purple/10">
      <ExpertLoginHeader />
      
      <ExpertLoginTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogin={onLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    </div>
  );
};

export default ExpertLoginContent;
