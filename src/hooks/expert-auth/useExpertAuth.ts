
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
    login: (email: string, password: string) => auth.login(email, password, { asExpert: true }),
    logout: auth.logout,
    // Use properties that exist in AuthContext
    updateProfile: auth.updateProfile, // Use generic updateProfile instead of updateExpertProfile
    error: auth.error,
    initialized: !auth.isLoading,
    hasUserAccount: auth.hasUserAccount || false // Provide a default value
  };
};
