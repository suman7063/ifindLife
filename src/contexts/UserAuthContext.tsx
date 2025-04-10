
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
}

// Create the context
const UserAuthContext = createContext<UserAuthContextType | null>(null);

// Provider component that wraps the app and makes auth object available to any child component that calls useUserAuth()
export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  // Adapt auth context to match UserAuthContext interface
  const userAuthValue: UserAuthContextType = {
    currentUser: auth.userProfile,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.state.authLoading || false,
    loading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    signup: auth.signup,
    updateProfile: auth.updateUserProfile,
    updateProfilePicture: async (file: File) => {
      // We need to implement this storage functionality
      if (!auth.user) {
        throw new Error("User not authenticated");
      }
      
      try {
        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${auth.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase storage
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            upsert: true
          });
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        // Update user profile
        const success = await auth.updateUserProfile({
          profile_picture: publicUrl
        });
        
        if (!success) {
          throw new Error("Failed to update profile with new image URL");
        }
        
        return publicUrl;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
      }
    },
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    addReview: auth.reviewExpert,
    profileNotFound: !auth.userProfile && !auth.isLoading
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

// Import Supabase for the updateProfilePicture function
import { supabase } from '@/lib/supabase';
