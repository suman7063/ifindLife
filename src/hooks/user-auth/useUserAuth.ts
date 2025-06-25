
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

/**
 * Simplified user authentication hook
 * Provides backward compatibility while using the unified auth context
 */
export const useUserAuth = () => {
  const auth = useAuth();
  
  return {
    // Core auth properties
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    userProfile: auth.userProfile,
    
    // Backward compatibility aliases
    currentUser: ensureUserProfileCompatibility(auth.userProfile),
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading,
    
    // Auth methods
    login: auth.login,
    logout: auth.logout,
    register: auth.signup, // Map register to signup
    updateProfile: auth.updateProfile,
    updateProfilePicture: auth.updateProfilePicture || (async () => null),
    
    // User-specific properties
    walletBalance: auth.walletBalance,
    error: auth.error,
    
    // Referral functionality
    getReferralLink: auth.getReferralLink || (() => null),
  };
};
