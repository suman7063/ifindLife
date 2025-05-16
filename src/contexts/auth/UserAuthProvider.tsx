
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
    login: auth.login || (async () => { 
      console.error("Login function not available in UserAuthProvider");
      return false;
    }),
    signup: auth.signup || (async () => { 
      console.error("Signup function not available in UserAuthProvider");
      return false;
    }),
    logout: auth.logout || (async () => { 
      console.error("Logout function not available in UserAuthProvider");
      return false;
    }),
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isAuthenticated && !auth.isLoading,
    updateProfile: auth.updateProfile || (async () => { 
      console.error("UpdateProfile function not available in UserAuthProvider");
      return false;
    }),
    updatePassword: auth.updatePassword || (async () => {
      console.error("UpdatePassword function not available in UserAuthProvider");
      return false;
    }),
    
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

  console.log('UserAuthProvider rendering with login available:', !!userAuthValue.login);

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};
