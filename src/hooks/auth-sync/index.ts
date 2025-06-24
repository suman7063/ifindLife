
import { useEffect } from 'react';
import { useAuth as useAuthContext } from '@/contexts/auth/AuthContext'; 
import { UserProfile } from '@/types/database/unified';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

/**
 * Hook to synchronize authentication state with other contexts
 * It can convert between different user profile types as needed
 */
export function useAuthSync() {
  const auth = useAuthContext();
  const { toTypeA, toTypeB } = useProfileTypeAdapter();
  
  // Access the raw profile for internal use
  const profile = auth.profile;
  
  // Get profile as type B for compatibility with some components
  const getProfileAsTypeB = () => {
    if (!profile) return null;
    return toTypeB(profile);
  };
  
  // This effect can be used to sync with global states
  useEffect(() => {
    // You can add global state synchronization here if needed
    console.log('Auth sync - auth state changed:', { 
      isAuthenticated: auth.isAuthenticated,
      role: auth.role
    });
  }, [auth.isAuthenticated, auth.role]);

  return {
    // Re-export auth context properties
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    profile,
    role: auth.role,
    
    // Add conversion utilities
    profileB: getProfileAsTypeB(),
    getProfileAsTypeB,
    
    // Authentication methods
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout
  };
}
