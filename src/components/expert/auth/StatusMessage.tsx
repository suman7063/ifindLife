
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

type StatusMessageType = 'info' | 'warning' | 'success' | 'error';

interface StatusMessageProps {
  type: StatusMessageType;
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  return (
    <Alert variant={type === "error" ? "destructive" : "default"}>
      {type === 'info' && <Info className="h-4 w-4" />}
      {type === 'warning' && <AlertCircle className="h-4 w-4" />}
      {type === 'error' && <AlertCircle className="h-4 w-4" />}
      <AlertTitle>
        {type === 'success' ? 'Success' : 
         type === 'info' ? 'Information' : 
         type === 'warning' ? 'Warning' : 'Error'}
      </AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default StatusMessage;
