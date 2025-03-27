
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { 
  updateUserProfile, 
  updateProfilePicture as updateProfilePic
} from '@/utils/profileUpdater';
import { toast } from 'sonner';

export const useProfileManagement = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser || !currentUser.id) {
      toast.error("You must be logged in to update your profile");
      return false;
    }
    
    setIsUpdating(true);
    try {
      console.log("Updating user profile with data:", profileData);
      const result = await updateUserProfile(currentUser.id, profileData);
      
      if (result) {
        // Update the local state with the new data
        setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
        console.log("Profile updated successfully");
        return true;
      }
      
      console.log("Profile update failed");
      return false;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfilePicture = async (file: File): Promise<string> => {
    if (!currentUser || !currentUser.id) {
      toast.error("You must be logged in to update your profile picture");
      throw new Error("User not authenticated");
    }

    setIsUpdating(true);
    try {
      console.log("Starting profile picture update for user:", currentUser.id);
      
      // Call the utility function to upload the image and update the database
      const publicUrl = await updateProfilePic(currentUser.id, file);
      console.log("Received public URL after upload:", publicUrl);
      
      // Update the current user state with the new profile picture URL
      setCurrentUser(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          profilePicture: publicUrl 
        };
      });
      
      console.log("Profile picture updated in local state");
      return publicUrl;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error; // Re-throw to allow component to handle the error
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    updateProfilePicture,
    isUpdating
  };
};
