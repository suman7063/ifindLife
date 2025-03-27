
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { 
  updateUserProfile, 
  updateProfilePicture as updateProfilePic
} from '@/utils/userProfileUtils';

export const useProfileManagement = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser || !currentUser.id) return false;

    const result = await updateUserProfile(currentUser.id, profileData);
    if (result) {
      setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
      return true;
    }
    return false;
  };

  const updateProfilePicture = async (file: File): Promise<string> => {
    if (!currentUser || !currentUser.id) throw new Error("User not authenticated");

    try {
      console.log("Starting profile picture update for user:", currentUser.id);
      const publicUrl = await updateProfilePic(currentUser.id, file);
      console.log("Received public URL:", publicUrl);
      
      // Update the current user state with the new profile picture URL
      setCurrentUser(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          profilePicture: publicUrl 
        };
      });
      
      return publicUrl;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error; // Re-throw to allow component to handle the error
    }
  };

  return {
    updateProfile,
    updateProfilePicture
  };
};
