
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserAuthContextType } from '@/contexts/auth/types';

// A compatibility layer to provide both old-style user auth and expert auth 
// interfaces for components that haven't been updated to use the unified auth
export const useAuthBackCompat = () => {
  const auth = useAuth();
  
  // Create a user auth compatible context
  const userAuth: UserAuthContextType = {
    currentUser: auth.state.userProfile,
    user: auth.state.user,
    session: auth.state.session,
    isAuthenticated: auth.state.isAuthenticated && auth.state.role === 'user',
    loading: auth.state.isLoading,
    authLoading: auth.state.authLoading,
    authError: auth.state.authError,
    favoritesCount: auth.state.favoritesCount,
    referrals: auth.state.referrals,
    userSettings: auth.state.userSettings,
    walletBalance: auth.state.walletBalance,
    hasProfile: auth.state.hasProfile,
    profileLoading: auth.state.profileLoading,
    profileError: auth.state.profileError,
    isExpertUser: auth.state.isExpertUser,
    expertId: auth.state.expertId,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateProfile: auth.updateUserProfile,
    updateUserSettings: auth.updateUserSettings,
    updateEmail: auth.updateEmail,
    updatePassword: auth.updatePassword,
    resetPassword: auth.resetPassword,
    sendVerificationEmail: auth.sendVerificationEmail,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    checkIsFavorite: auth.checkIsFavorite,
    refreshFavoritesCount: auth.refreshFavoritesCount,
    getReferrals: auth.getReferrals,
    refreshWalletBalance: auth.refreshWalletBalance,
    addFunds: auth.addFunds,
    deductFunds: auth.deductFunds,
    reportExpert: auth.reportExpert,
    reviewExpert: auth.reviewExpert,
    getExpertShareLink: auth.getExpertShareLink,
    hasTakenServiceFrom: auth.hasTakenServiceFrom
  };
  
  // Create an expert auth compatible context (simplified for now)
  const expertAuth = {
    // Expert-specific fields would be added here
    currentExpert: auth.state.expertProfile,
    isExpert: auth.state.role === 'expert',
    // Common fields
    user: auth.state.user,
    session: auth.state.session,
    isAuthenticated: auth.state.isAuthenticated && auth.state.role === 'expert',
    loading: auth.state.isLoading
  };

  // Auth synchronization methods
  const authSync = {
    syncAuthState: async () => {
      console.log('Auth state sync requested');
      await auth.refreshFavoritesCount();
      await auth.refreshWalletBalance();
      return true;
    }
  };
  
  return {
    userAuth,
    expertAuth,
    authSync
  };
};
