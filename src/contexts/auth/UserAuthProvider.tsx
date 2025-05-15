
import React from 'react';
import { UserAuthContext } from './UserAuthContext';
import { useAuth } from './AuthContext';
import { NewReview, NewReport } from '@/types/supabase/tables';

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Create a compatibility layer for the user auth context
  const userAuthValue = {
    currentUser: auth.userProfile || auth.profile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: auth.login, 
    signup: auth.signup,
    logout: auth.logout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile, 
    updatePassword: auth.updatePassword || (async () => false),
    
    // Default implementations for extended functionality
    addToFavorites: auth.addToFavorites || (async (expertId: number) => false),
    removeFromFavorites: auth.removeFromFavorites || (async (expertId: number) => false),
    rechargeWallet: auth.rechargeWallet || (async (amount: number) => false),
    addReview: auth.addReview || (async (review: NewReview | string, rating?: number, comment?: string) => false),
    reportExpert: auth.reportExpert || (async (report: NewReport | string, reason?: string, details?: string) => false),
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async (id: string | number) => false),
    getExpertShareLink: auth.getExpertShareLink || ((expertId: string | number) => ''),
    getReferralLink: auth.getReferralLink || (() => null),
    user: auth.user,
    updateProfilePicture: auth.updateProfilePicture || (async (file: File) => null)
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
