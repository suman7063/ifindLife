
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
  
  console.log("useProfileManagement hook initialized with:", { 
    currentUserExists: !!currentUser,
    currentUserId: currentUser?.id,
    isUpdating 
  });
  
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    console.log("updateProfile called with data:", profileData);
    
    if (!currentUser || !currentUser.id) {
      console.error("updateProfile failed: No authenticated user", { currentUser });
      toast.error("You must be logged in to update your profile");
      return false;
    }
    
    setIsUpdating(true);
    try {
      console.log("Calling updateUserProfile utility with:", { 
        userId: currentUser.id, 
        profileData 
      });
      
      const result = await updateUserProfile(currentUser.id, profileData);
      
      console.log("updateUserProfile result:", result);
      
      if (result) {
        // Update the local state with the new data
        console.log("Updating local state with new profile data");
        setCurrentUser(prev => {
          const updatedUser = prev ? { ...prev, ...profileData } : null;
          console.log("Updated user state:", updatedUser);
          return updatedUser;
        });
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
    console.log("updateProfilePicture in useProfileManagement called with file:", { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
    
    if (!currentUser || !currentUser.id) {
      console.error("updateProfilePicture failed: No authenticated user", { currentUser });
      toast.error("You must be logged in to update your profile picture");
      throw new Error("User not authenticated");
    }

    setIsUpdating(true);
    try {
      console.log("Starting profile picture update for user:", currentUser.id);
      
      // Call the utility function to upload the image and update the database
      console.log("Calling updateProfilePic utility function");
      const publicUrl = await updateProfilePic(currentUser.id, file);
      console.log("Received public URL after upload:", publicUrl);
      
      // Update the current user state with the new profile picture URL
      console.log("Updating current user state with new profile picture URL");
      setCurrentUser(prev => {
        if (!prev) {
          console.log("Cannot update state: currentUser is null");
          return null;
        }
        const updatedUser = { 
          ...prev, 
          profilePicture: publicUrl 
        };
        console.log("Updated user state:", updatedUser);
        return updatedUser;
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
