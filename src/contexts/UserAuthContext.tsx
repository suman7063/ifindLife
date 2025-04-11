
import React, { createContext, useContext } from 'react';
import { useAuth } from './auth/AuthContext';
import { UserProfile } from '@/types/supabase/userProfile';
import { User } from '@supabase/supabase-js';
import { NewReview, NewReport } from '@/types/common';

// Define the UserAuthContext type
export interface UserAuthContextType {
  currentUser: UserProfile | null;
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signup: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string>;
  addToFavorites: (expertId: string) => Promise<boolean>;
  removeFromFavorites: (expertId: string) => Promise<boolean>;
  addReview: (review: NewReview) => Promise<boolean>;
  isLoggingOut?: boolean;
  profileNotFound: boolean;
  reportExpert: (report: NewReport) => Promise<boolean>;
  hasTakenServiceFrom: (expertId: string) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  getReferralLink: () => string | null;
}

// Create the context
const UserAuthContext = createContext<UserAuthContextType | null>(null);

// Provider component that wraps the app and makes auth object available to any child component that calls useUserAuth()
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  // Create value object with all required properties
  const userAuthValue: UserAuthContextType = {
    currentUser: auth.userProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.state?.isLoading || false,
    loading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    signup: auth.signup,
    updateProfile: auth.updateUserProfile,
    updateProfilePicture: auth.updateProfilePicture,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    addReview: (review: NewReview) => {
      return auth.reviewExpert(review.expertId, review.rating, review.comment);
    },
    reportExpert: (report: NewReport) => {
      return auth.reportExpert(report.expertId, report.reason, report.details);
    },
    profileNotFound: !auth.userProfile && !auth.isLoading,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    rechargeWallet: auth.addFunds,
    getReferralLink: auth.getReferralLink,
  };

  return (
    <UserAuthContext.Provider value={userAuthValue}>
      {children}
    </UserAuthContext.Provider>
  );
};

// Custom hook that shortens the imports needed to use the auth context
export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
