
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface UserLogoutAlertProps {
  profileName: string | undefined;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
}

const UserLogoutAlert: React.FC<UserLogoutAlertProps> = ({
  profileName,
  isLoggingOut,
  onLogout
}) => {
  return (
    <div className="space-y-4 p-4">
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          You are currently logged in as an expert. You need to log out as an expert before logging in as a user.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={onLogout} 
        variant="destructive" 
        className="w-full flex items-center justify-center"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Logging Out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out as Expert
          </>
        )}
      </Button>
    </div>
  );
};

export default UserLogoutAlert;
