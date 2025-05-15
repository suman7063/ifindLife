
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

/**
 * This hook centralizes and synchronizes auth state across the application
 */
export const useSingleSourceOfTruth = () => {
  const auth = useAuth();

  // Log authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: auth.isAuthenticated,
      role: auth.role,
      sessionType: auth.sessionType,
      userProfile: auth.userProfile ? true : false,
      expertProfile: auth.expertProfile ? true : false,
    });
    
    // We're returning a cleanup function, not a void function
    return () => {
      console.log('Auth state cleanup');
    };
  }, [auth.isAuthenticated, auth.role, auth.sessionType]);

  return {
    ...auth,
    // Any additional synchronized state or functions
  };
};

export default useSingleSourceOfTruth;
