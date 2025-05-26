import React from 'react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import ProfilePictureUploader from '@/components/common/ProfilePictureUploader';
import { toast } from 'sonner';

const ProfilePictureSection: React.FC = () => {
  const { currentUser, updateProfilePicture } = useUserAuth();

  console.log('ProfilePictureSection rendering:', { 
    currentUserExists: !!currentUser,
    currentUserId: currentUser?.id,
    profilePicture: currentUser?.profile_picture,
    updateProfilePictureFunction: !!updateProfilePicture
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      console.log("Starting image upload process", { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type 
      });
      
      // Make sure we have a valid user before attempting to upload
      if (!currentUser || !currentUser.id) {
        console.error("Upload failed: No authenticated user found", { currentUser });
        toast.error('You must be logged in to update your profile picture');
        throw new Error("User not authenticated");
      }
      
      console.log("Calling updateProfilePicture with:", { userId: currentUser.id, fileName: file.name });
      
      // Check if updateProfilePicture exists
      if (!updateProfilePicture) {
        console.error("updateProfilePicture function is not available");
        toast.error('Unable to update profile picture due to a system error');
        throw new Error("updateProfilePicture function is not available");
      }
      
      const url = await updateProfilePicture(file);
      console.log("Image uploaded successfully, received URL:", url);
      toast.success('Profile picture updated successfully!');
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      throw error;
    }
  };

  if (!currentUser) {
    console.log("ProfilePictureSection: Not rendering - no currentUser");
    return null;
  }

  console.log("ProfilePictureSection: Rendering with user data", { 
    name: currentUser.name,
    profilePicture: currentUser.profile_picture
  });

  return (
    <div className="flex justify-center mb-6">
      <ProfilePictureUploader
        currentImage={currentUser.profile_picture}
        onImageUpload={handleImageUpload}
        name={currentUser.name || ''}
      />
    </div>
  );
};

export default ProfilePictureSection;
