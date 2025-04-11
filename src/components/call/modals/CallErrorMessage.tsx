
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface CallErrorMessageProps {
  errorMessage: string | null;
  onRetry: () => void;
}

const CallErrorMessage: React.FC<CallErrorMessageProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errorMessage || 'Failed to connect the call. Please check your camera and microphone permissions.'}
        </AlertDescription>
      </Alert>
      <Button 
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </Button>
    </div>
  );
};

export default CallErrorMessage;
