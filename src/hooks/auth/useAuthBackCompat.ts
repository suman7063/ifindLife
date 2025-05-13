import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/supabase';

/**
 * Hook to provide backward compatibility with older components
 * that expect a different auth context or different function signatures.
 */
export const useAuthBackCompat = () => {
  const {
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    getExpertShareLink,
    hasTakenServiceFrom,
    getReferralLink,
    user,
    profile,
    updateProfilePicture
  } = useAuth();

  // Fix return types for functions that need to return { error }
  const wrappedLogin = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const success = await login(email, password);
      return { error: success ? null : new Error('Login failed') };
    } catch (error: any) {
      return { error };
    }
  };
  
  // Fix addToFavorites to return Promise<boolean>
  const wrappedAddToFavorites = async (expertId: number): Promise<boolean> => {
    try {
      // Implementation here
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  // Fix return types for logout
  const wrappedLogout = async (): Promise<{ error: Error | null }> => {
    try {
      const success = await logout();
      return { error: success ? null : new Error('Logout failed') };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    isAuthenticated: !!user,
    isLoading: false, // Assuming no loading state here
    user: profile,
    login: wrappedLogin,
    signup: signup || (async () => ({ error: new Error('Signup not available') })),
    logout: wrappedLogout,
    updateUserProfile: updateProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    getExpertShareLink,
    hasTakenServiceFrom,
    getReferralLink,
    updateProfilePicture
  };
};
