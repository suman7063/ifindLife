
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

export interface CallErrorMessageProps {
  errorMessage: string;
  onRetry: () => Promise<boolean>;
  onClose: () => void;
}

const CallErrorMessage: React.FC<CallErrorMessageProps> = ({ 
  errorMessage, 
  onRetry, 
  onClose 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
      <div className="rounded-full bg-red-100 p-6">
        <AlertOctagon className="h-12 w-12 text-red-500" />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
        <p className="text-muted-foreground max-w-md">
          {errorMessage || 'There was an error establishing the call connection. Please try again.'}
        </p>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default CallErrorMessage;
