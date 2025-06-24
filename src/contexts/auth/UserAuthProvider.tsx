
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './UnifiedAuthContext';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatibility layer for the user auth context
  const userAuthValue = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile,
    updatePassword: auth.updatePassword,
    
    // User-specific methods
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink,
    getReferralLink: auth.getReferralLink,
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
