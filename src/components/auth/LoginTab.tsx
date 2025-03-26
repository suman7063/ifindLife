
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { Skeleton } from '@/components/ui/skeleton';

interface LoginTabProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  socialLoading: string | null;
  authLoading: boolean;
  setSocialLoading?: (provider: string | null) => void;
}

const LoginTab: React.FC<LoginTabProps> = ({
  onLogin,
  loading,
  isLoggingIn,
  loginError,
  socialLoading,
  authLoading,
  setSocialLoading
}) => {
  return (
    <div className="space-y-4">
      {loginError && (
        <Alert variant="destructive">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <LoginForm 
        onLogin={onLogin} 
        loading={loading || isLoggingIn || authLoading} 
        userType="user" 
      />
      
      {authLoading && !isLoggingIn ? (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <SocialLogin 
          socialLoading={socialLoading}
          authLoading={authLoading || isLoggingIn}
          setSocialLoading={setSocialLoading}
        />
      )}
    </div>
  );
};

export default LoginTab;
