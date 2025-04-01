
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface UserLogoutAlertProps {
  profileName: string | undefined;
  isLoggingOut: boolean;
  onLogout: () => Promise<boolean>;
  logoutType?: 'user' | 'expert';
}

const UserLogoutAlert: React.FC<UserLogoutAlertProps> = ({
  profileName,
  isLoggingOut,
  onLogout,
  logoutType = 'user'
}) => {
  return (
    <div className="space-y-4 p-4">
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {logoutType === 'user' 
            ? `You are currently logged in as ${profileName || 'a user'}. You need to log out before logging in as an expert.`
            : `You are currently logged in as ${profileName || 'an expert'}. You need to log out before logging in as a user.`
          }
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
            {logoutType === 'user' ? 'Log Out as User' : 'Log Out as Expert'}
          </>
        )}
      </Button>
    </div>
  );
};

export default UserLogoutAlert;
