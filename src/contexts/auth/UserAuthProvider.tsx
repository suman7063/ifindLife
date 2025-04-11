
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile } from '@/types/supabase';
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

  // Create value object with all required properties and ensure types match
  const userAuthValue: UserAuthContextType = {
    currentUser: auth.userProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    signup: auth.signup || (async () => false),
    updateProfile: auth.updateUserProfile || (async (data) => false),
    updateProfilePicture: auth.updateProfilePicture || (async () => ""),
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    addReview: async (review: NewReview): Promise<boolean> => {
      return auth.reviewExpert ? 
        auth.reviewExpert(review.expertId, review.rating, review.comment) : 
        false;
    },
    reportExpert: async (report: NewReport): Promise<boolean> => {
      return auth.reportExpert ? 
        auth.reportExpert(report.expertId, report.reason, report.details) : 
        false;
    },
    profileNotFound: !auth.userProfile && !auth.isLoading,
    hasTakenServiceFrom: auth.hasTakenServiceFrom || (async () => false),
    rechargeWallet: auth.addFunds || (async () => false),
    getReferralLink: auth.getReferralLink || (() => null),
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
