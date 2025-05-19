
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AlertMessagesProps {
  errorMessage: string | null;
  debugInfo: string | null;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ errorMessage, debugInfo }) => {
  if (!errorMessage && !debugInfo) return null;
  
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {debugInfo && (
        <Alert>
          <AlertDescription className="text-amber-600">
            {debugInfo}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
