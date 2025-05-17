
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';

export const useExpertAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error('useExpertAuth must be used within an AuthProvider');
  }
  
  // Check if the user is logged in as an expert
  if (auth.role !== 'expert' && auth.isAuthenticated) {
    console.warn('User is authenticated but not as an expert');
  }
  
  return {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    isLoading: auth.isLoading,
    login: (email: string, password: string) => {
      console.log('Expert login function called with:', { email });
      // Ensure we explicitly set asExpert to true
      return auth.login(email, password, { asExpert: true });
    },
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
