
import { useAuth } from '@/contexts/auth/AuthContext';
import { useState, useEffect } from 'react';

/**
 * This hook provides backward compatibility for code that was written before
 * the auth system was consolidated into a single AuthContext.
 */
export const useAuthBackCompat = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Initialize on component mount
  useEffect(() => {
    if (!auth.isLoading) {
      setLoading(false);
    }
  }, [auth.isLoading]);
  
  // Compatibility function for userAuth
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    loading: auth.isLoading,
    authLoading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading && auth.isAuthenticated,
    user: auth.user,
    
    // Auth methods
    login: (email: string, password: string) => auth.login(email, password, 'user'),
    logout: auth.logout,
    signup: auth.signup,
    
    // Profile methods
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    
    // Expert interactions
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink,
    getReferralLink: auth.getReferralLink,
    updateProfilePicture: async (file: File) => {
      // Implement file upload functionality if needed
      return null; 
    },
    refreshProfile: async () => {
      // This would trigger a refresh of the user profile
      if (auth.user?.id) {
        // This would be implemented properly in the auth context
      }
    }
  };
  
  // Compatibility function for expertAuth
  const expertAuth = {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    loading: auth.isLoading,
    initialized: !auth.isLoading,
    error: auth.isLoading ? null : (auth.expertProfile ? null : 'No expert profile found'),
    user: auth.user,
    
    // Auth methods
    login: (email: string, password: string) => auth.login(email, password, 'expert'),
    logout: auth.logout,
    register: auth.expertSignup,
    
    // Profile methods
    updateProfile: auth.updateExpertProfile,
    
    // Expert specific methods
    hasUserAccount: async () => {
      // Check if the current user also has a user profile
      return !!auth.userProfile && auth.isAuthenticated;
    }
  };
  
  return {
    userAuth,
    expertAuth,
    loading
  };
};
