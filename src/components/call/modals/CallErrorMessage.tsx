
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallErrorMessageProps {
  errorMessage: string;
  onRetry: () => void;
  onClose?: () => void;
}

const CallErrorMessage: React.FC<CallErrorMessageProps> = ({ errorMessage, onRetry, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Call Error</h3>
        <p className="text-muted-foreground">
          {errorMessage || "We couldn't establish a call connection. Please try again."}
        </p>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md w-full max-w-md">
        <p className="text-sm text-amber-800 dark:text-amber-400">
          Please ensure your camera and microphone are properly connected and you've granted permission to use them.
        </p>
      </div>
      
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
};

export default CallErrorMessage;
