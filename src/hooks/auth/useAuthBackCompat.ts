
import { useAuth } from '@/contexts/auth/AuthContext';

// This compatibility layer helps with backward compatibility
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create backward compatible API for components using old auth patterns
  return {
    // Main auth context
    auth,
    
    // For components using old userAuth
    userAuth: {
      user: auth.user,
      profile: auth.profile,
      currentUser: auth.profile, // Alias for backward compatibility
      isAuthenticated: auth.isAuthenticated,
      loading: auth.isLoading,
      login: auth.login,
      logout: auth.logout,
      updateProfile: auth.updateProfile,
      updateUserProfile: auth.updateProfile, // Alias for backward compatibility
      updatePassword: auth.updatePassword,
    },
    
    // For components using old expertAuth
    expertAuth: {
      currentExpert: auth.expertProfile,
      user: auth.user,
      isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
      loading: auth.isLoading,
      error: null,
      login: (email: string, password: string) => auth.login(email, password, 'expert'),
      logout: auth.logout,
      updateProfile: (updates: any) => auth.updateExpertProfile(updates).then(({ error }) => !error),
    }
  };
};
