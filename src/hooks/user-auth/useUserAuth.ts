
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';

export const useUserAuth = () => {
  const auth = useAuth();
  
  return {
    // Direct auth properties
    ...auth,
    
    // Adapted user profile for backward compatibility
    currentUser: auth.userProfile,
    
    // Alias methods for backward compatibility
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading,
    
    // User-specific methods
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture,
  };
};
