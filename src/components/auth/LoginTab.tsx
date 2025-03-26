
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';

interface LoginTabProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  socialLoading: string | null;
  authLoading: boolean;
}

const LoginTab: React.FC<LoginTabProps> = ({
  onLogin,
  loading,
  isLoggingIn,
  loginError,
  socialLoading,
  authLoading
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
        loading={loading || isLoggingIn} 
        userType="user" 
      />
      
      <SocialLogin 
        socialLoading={socialLoading}
        authLoading={authLoading}
      />
    </div>
  );
};

export default LoginTab;
