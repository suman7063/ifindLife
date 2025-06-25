
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

export const useUserAuth = () => {
  const auth = useAuth();
  
  // Provide backward compatibility while using the unified auth context
  return {
    // Direct auth properties
    ...auth,
    
    // Adapted user profile for backward compatibility
    currentUser: ensureUserProfileCompatibility(auth.userProfile),
    
    // Alias methods for backward compatibility
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading,
    
    // User-specific methods
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async () => null),
  };
};
