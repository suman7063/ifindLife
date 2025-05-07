
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onReset?: () => void;
  retryLabel?: string;
  resetLabel?: string;
  variant?: 'default' | 'critical';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error Occurred',
  message,
  onRetry,
  onReset,
  retryLabel = 'Retry',
  resetLabel = 'Reset',
  variant = 'default',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-5 w-5 mr-2" />
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="mt-2">{message}</AlertDescription>
      </Alert>
      
      <div className="flex items-center space-x-4 mt-4">
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="default" 
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> {retryLabel}
          </Button>
        )}
        
        {onReset && (
          <Button 
            onClick={onReset} 
            variant="outline"
          >
            {resetLabel}
          </Button>
        )}
      </div>
      
      {variant === 'critical' && (
        <p className="text-sm text-gray-500 mt-4 text-center max-w-md">
          This appears to be a system error. If the problem persists, please contact technical support.
        </p>
      )}
    </div>
  );
};

export default ErrorDisplay;
