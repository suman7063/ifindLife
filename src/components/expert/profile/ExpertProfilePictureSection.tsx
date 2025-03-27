
import React from 'react';
import ProfilePictureUploader from '@/components/common/ProfilePictureUploader';
import { ExpertFormData } from '../types';

interface ExpertProfilePictureSectionProps {
  expert: ExpertFormData;
  onProfileUpdate: (updatedExpert: ExpertFormData) => void;
}

const ExpertProfilePictureSection: React.FC<ExpertProfilePictureSectionProps> = ({ 
  expert,
  onProfileUpdate
}) => {
  const handleProfilePictureUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          
          // Update expert in localStorage with new profile picture
          const experts = JSON.parse(localStorage.getItem('ifindlife-experts') || '[]');
          const updatedExperts = experts.map((e: ExpertFormData) => {
            if (e.email === expert.email) {
              return { ...e, profilePicture: base64String };
            }
            return e;
          });
          
          localStorage.setItem('ifindlife-experts', JSON.stringify(updatedExperts));
          
          // Update local state with the updated expert object
          const updatedExpert = { ...expert, profilePicture: base64String };
          onProfileUpdate(updatedExpert);
          
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div className="flex justify-center mb-6">
      <ProfilePictureUploader
        currentImage={expert.profilePicture}
        onImageUpload={handleProfilePictureUpload}
        name={expert.name}
      />
    </div>
  );
};

export default ExpertProfilePictureSection;
