
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface CallErrorMessageProps {
  errorMessage: string;
  onRetry: () => void;
}

const CallErrorMessage: React.FC<CallErrorMessageProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
        <AlertOctagon className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-6">
        {errorMessage || 'There was a problem establishing the chat session.'}
      </p>
      
      <Button 
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};

export default CallErrorMessage;
