
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export const useExpertAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    console.error('useExpertAuth must be used within an AuthProvider');
    throw new Error('useExpertAuth must be used within an AuthProvider');
  }
  
  // Check if the user is logged in as an expert
  if (auth.role !== 'expert' && auth.isAuthenticated) {
    console.warn('User is authenticated but not as an expert');
  }
  
  // Create a wrapped login function that provides better feedback
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    if (!auth.login || typeof auth.login !== 'function') {
      console.error('Expert login function not available');
      toast.error('Authentication service is temporarily unavailable');
      return false;
    }
    
    console.log('Expert login function called with:', { email });
    try {
      // Ensure we explicitly set asExpert to true
      return await auth.login(email, password, { asExpert: true });
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
    hasUserAccount: auth.hasUserAccount || false,
    register: auth.registerExpert || (async () => false)
  };
};

export { useAuth as useAuthUnified } from '@/contexts/auth/AuthContext';
