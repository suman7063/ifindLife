
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';

export const useExpertAuth = () => {
  const auth = useAuth();
  
  console.log('Expert auth state:', {
    isAuthenticated: auth.isAuthenticated,
    hasExpertProfile: !!auth.expertProfile,
    role: auth.role,
    isLoading: auth.isLoading
  });
  
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    console.log('Expert login attempt:', { email });
    
    try {
      const success = await auth.login(email, password, { asExpert: true });
      
      if (success) {
        console.log('Expert login successful');
      } else {
        console.error('Expert login failed');
      }
      
      return success;
    } catch (error) {
      console.error('Error during expert login:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    }
  };
  
  return {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    isLoading: auth.isLoading,
    login: handleExpertLogin,
    logout: auth.logout,
    updateProfile: auth.updateProfile,
    updateExpertProfile: auth.updateExpertProfile,
    error: auth.error,
    initialized: !auth.isLoading,
    hasUserAccount: auth.hasUserAccount,
    register: auth.registerExpert
  };
};
