
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

  const updateProfilePicture = async (file: File): Promise<string | null> => {
    if (!currentUser || !currentUser.id) return null;

    try {
      const publicUrl = await updateProfilePic(currentUser.id, file);
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
      return null;
    }
  };

  return {
    updateProfile,
    updateProfilePicture
  };
};
