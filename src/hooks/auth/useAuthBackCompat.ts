
import { useAuth as useUnifiedAuth } from '@/contexts/auth/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook that provides backward compatibility for old auth hooks
 * Maps unified auth context to the separate old expert/user auth contexts
 */
export const useAuthBackCompat = () => {
  const unifiedAuth = useUnifiedAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Create a compatible expert auth implementation
  const expertAuth = {
    currentExpert: unifiedAuth.expertProfile,
    isAuthenticated: unifiedAuth.isAuthenticated && unifiedAuth.role === 'expert',
    loading: unifiedAuth.isLoading,
    isLoading: unifiedAuth.isLoading,
    error: unifiedAuth.error || error,
    initialized: true,
    authInitialized: true,
    user: unifiedAuth.user,
    login: async (email: string, password: string) => {
      try {
        return await unifiedAuth.login(email, password, 'expert');
      } catch (error: any) {
        console.error('Expert login error:', error);
        setError(error?.message || 'An error occurred during expert login');
        toast.error('An error occurred during expert login');
        return false;
      }
    },
    logout: unifiedAuth.logout,
    register: async (data: any) => {
      if (unifiedAuth.expertSignup) {
        return await unifiedAuth.expertSignup(data);
      }
      setError('Expert signup not implemented');
      console.error('Expert signup not implemented');
      return false;
    },
    updateProfile: async () => {
      setError('Update profile not yet implemented in compatibility layer');
      console.error('Update profile not yet implemented in compatibility layer');
      return false;
    },
    hasUserAccount: async () => {
      setError('hasUserAccount not yet implemented in compatibility layer');
      console.error('hasUserAccount not yet implemented in compatibility layer');
      return false;
    }
  };
  
  // Create a compatible user auth implementation
  const userAuth = {
    currentUser: unifiedAuth.userProfile,
    isAuthenticated: unifiedAuth.isAuthenticated && unifiedAuth.role === 'user',
    loading: unifiedAuth.isLoading,
    isLoading: unifiedAuth.isLoading,
    error: unifiedAuth.error || error,
    initialized: true,
    authInitialized: true,
    user: unifiedAuth.user,
    login: async (email: string, password: string) => {
      try {
        return await unifiedAuth.login(email, password, 'user');
      } catch (error: any) {
        console.error('User login error:', error);
        setError(error?.message || 'An error occurred during user login');
        toast.error('An error occurred during user login');
        return false;
      }
    },
    logout: unifiedAuth.logout,
    register: async (data: any) => {
      setError('User register not yet implemented in compatibility layer');
      console.error('User register not yet implemented in compatibility layer');
      return false;
    }
  };
  
  return { expertAuth, userAuth };
};
