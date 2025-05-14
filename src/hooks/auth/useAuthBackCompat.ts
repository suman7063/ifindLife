
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export function useAuthBackCompat() {
  const auth = useAuth();
  
  // Create backward-compatible objects for existing components
  const userAuth = {
    currentUser: auth.profile,
    updateProfile: auth.updateProfile,
    logout: auth.logout,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user'
  };
  
  const expertAuth = {
    currentUser: auth.expertProfile,
    updateProfile: auth.updateExpertProfile || ((data: any) => Promise.resolve(false)), // Default fallback
    logout: auth.logout,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert'
  };
  
  return {
    userAuth,
    expertAuth
  };
}
