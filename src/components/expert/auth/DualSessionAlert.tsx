
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DualSessionAlertProps {
  isLoggingOut: boolean;
  onLogout: () => Promise<boolean>;
}

const DualSessionAlert: React.FC<DualSessionAlertProps> = ({ isLoggingOut, onLogout }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Multiple Sessions Detected</AlertTitle>
      <AlertDescription className="flex flex-col space-y-4">
        <p>You are currently logged in as both a user and an expert. This can cause authentication issues.</p>
        <Button 
          onClick={onLogout} 
          variant="destructive" 
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Logging Out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out of All Accounts
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DualSessionAlert;
