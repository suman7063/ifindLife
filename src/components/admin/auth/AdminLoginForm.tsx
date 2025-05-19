
import React from 'react';
import { useAuth } from '@/contexts/admin-auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UsernameField from './components/UsernameField';
import PasswordField from './components/PasswordField';
import AlertMessages from './components/AlertMessages';
import CredentialsHelper from './components/CredentialsHelper';
import { useAdminLoginForm } from './hooks/useAdminLoginForm';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onLogin?: (username: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ 
  onLoginSuccess, 
  onLogin, 
  isLoading = false 
}) => {
  const { login: contextLogin } = useAuth();
  
  console.log('AdminLoginForm rendered', {
    hasProvidedLoginFunction: typeof onLogin === 'function',
    hasContextLoginFunction: typeof contextLogin === 'function'
  });

  const {
    username,
    setUsername,
    password,
    setPassword,
    errorMessage,
    debugInfo,
    isSubmitting,
    handleSubmit
  } = useAdminLoginForm({ 
    onLogin: onLogin || contextLogin,
    onLoginSuccess: () => {
      toast.success('Successfully logged in as administrator');
      onLoginSuccess();
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AlertMessages 
        errorMessage={errorMessage} 
        debugInfo={debugInfo} 
      />
      
      <UsernameField
        username={username}
        setUsername={setUsername}
        disabled={isLoading || isSubmitting}
      />
      
      <PasswordField
        password={password}
        setPassword={setPassword}
        disabled={isLoading || isSubmitting}
      />
      
      <CredentialsHelper />
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
