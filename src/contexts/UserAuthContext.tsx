
import React, { createContext, useContext } from 'react';
import { useAuth } from './auth/AuthContext';
import { UserProfile } from '@/types/supabase/userProfile';
import { User } from '@supabase/supabase-js';

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
  addReview: (expertId: string, rating: number, comment: string) => Promise<boolean>;
  isLoggingOut?: boolean;
  profileNotFound: boolean;
  reportExpert?: (report: { expertId: string, reason: string, details: string }) => Promise<boolean>;
  hasTakenServiceFrom?: (expertId: string) => Promise<boolean>;
  rechargeWallet?: (amount: number) => Promise<boolean>;
  getReferralLink?: () => string | null;
}

// Create the context
const UserAuthContext = createContext<UserAuthContextType | null>(null);

// Provider component that wraps the app and makes auth object available to any child component that calls useUserAuth()
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  // The issue was here - we need to ensure auth is properly initialized
  if (!auth) {
    // Return a loading state instead of trying to destructure undefined
    return <div>Loading authentication...</div>;
  }

  // Create value object with all required properties, using optional chaining to avoid null references
  const userAuthValue: UserAuthContextType = {
    currentUser: auth.userProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated || false,
    authLoading: auth.state?.authLoading || false,
    loading: auth.isLoading || false,
    login: auth.login || (async () => false),
    logout: auth.logout || (async () => false),
    signup: auth.signup || (async () => false),
    updateProfile: auth.updateUserProfile || (async () => false),
    updateProfilePicture: async (file: File) => {
      if (!auth.user) {
        throw new Error("User not authenticated");
      }
      
      try {
        // Fallback implementation if auth doesn't provide this function
        if (typeof auth.updateProfilePicture === 'function') {
          return auth.updateProfilePicture(file);
        }
        
        console.error("Profile picture update not implemented");
        return "";
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
      }
    },
    addToFavorites: auth.addToFavorites || (async () => false),
    removeFromFavorites: auth.removeFromFavorites || (async () => false),
    addReview: auth.reviewExpert || (async () => false),
    profileNotFound: !auth.userProfile && !auth.isLoading,
    reportExpert: auth.reportExpert,
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
