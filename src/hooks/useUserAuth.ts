
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';

export const useUserAuth = () => {
  // Get context but don't throw if missing
  const context = useContext(UserAuthContext);
  
  // Check if context exists and is not empty
  if (!context || Object.keys(context).length === 0) {
    console.error('useUserAuth must be used within a UserAuthProvider');
    // Return a default context with empty values and no-op functions instead of throwing
    return {
      currentUser: null,
      isAuthenticated: false,
      login: async () => false,
      signup: async () => false,
      logout: async () => false,
      loading: false,
      authLoading: false,
      profileNotFound: false,
      updateProfile: async () => false,
      updatePassword: async () => false,
      user: null,
    };
  }
  
  return context;
};

// For backward compatibility
export { useAuth } from '@/contexts/auth/AuthContext';
