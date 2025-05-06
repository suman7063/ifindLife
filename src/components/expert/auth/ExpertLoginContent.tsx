
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ExpertLoginHeader from './ExpertLoginHeader';
import ExpertLoginTabs from './ExpertLoginTabs';

interface ExpertLoginContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  isLogging?: boolean;
  loginError?: string | null;
  statusMessage?: { type: 'success' | 'error'; message: string } | null;
}

const ExpertLoginContent: React.FC<ExpertLoginContentProps> = ({
  activeTab,
  setActiveTab,
  onLogin,
  isLogging = false,
  loginError = null,
  statusMessage = null
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-100 max-w-md mx-auto">
      <ExpertLoginHeader />
      
      {statusMessage && (
        <Alert 
          variant={statusMessage.type === 'success' ? 'default' : 'destructive'} 
          className={`mb-4 ${statusMessage.type === 'success' ? 'bg-green-50 border-green-200' : ''}`}
        >
          {statusMessage.type === 'success' ? 
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : 
            <AlertCircle className="h-4 w-4 mr-2" />
          }
          <AlertDescription>{statusMessage.message}</AlertDescription>
        </Alert>
      )}
      
      <ExpertLoginTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogin={onLogin}
        isLoggingIn={isLogging}
        loginError={loginError}
      />
    </div>
  );
};

export default ExpertLoginContent;
