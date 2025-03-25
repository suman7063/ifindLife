
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
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser || !currentUser.id) return;

    const result = await updateUserProfile(currentUser.id, profileData);
    if (result) {
      setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
    }
  };

  const updateProfilePicture = async (file: File): Promise<string> => {
    if (!currentUser || !currentUser.id) throw new Error('User not authenticated');

    const publicUrl = await updateProfilePic(currentUser.id, file);
    setCurrentUser(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        profilePicture: publicUrl 
      };
    });
    return publicUrl;
  };

  return {
    updateProfile,
    updateProfilePicture
  };
};
