
import React from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import ProfilePictureUploader from '@/components/common/ProfilePictureUploader';
import { toast } from 'sonner';

const ProfilePictureSection: React.FC = () => {
  const { currentUser, updateProfilePicture } = useUserAuth();

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      console.log("Starting image upload process");
      
      // Make sure we have a valid user before attempting to upload
      if (!currentUser || !currentUser.id) {
        toast.error('You must be logged in to update your profile picture');
        throw new Error("User not authenticated");
      }
      
      const url = await updateProfilePicture(file);
      console.log("Image uploaded successfully, URL:", url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      throw error;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex justify-center mb-6">
      <ProfilePictureUploader
        currentImage={currentUser.profilePicture}
        onImageUpload={handleImageUpload}
        name={currentUser.name || ''}
      />
    </div>
  );
};

export default ProfilePictureSection;
