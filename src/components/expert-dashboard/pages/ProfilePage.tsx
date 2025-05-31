
import React, { useState } from 'react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';
import ProfileHeader from './profile/ProfileHeader';
import ProfileImageCard from './profile/ProfileImageCard';
import PersonalInformationCard from './profile/PersonalInformationCard';
import ProfessionalDetailsCard from './profile/ProfessionalDetailsCard';

const ProfilePage = () => {
  const { expert } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: expert?.name || expert?.full_name || '',
    email: expert?.email || expert?.contact_email || '',
    phone: expert?.phone || expert?.contact_phone || '',
    location: expert?.location || '',
    bio: expert?.bio || expert?.biography || '',
    specialization: expert?.specialization || '',
    experience_years: expert?.experience_years || 0,
    hourly_rate: expert?.hourly_rate || 0
  });

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: expert?.name || expert?.full_name || '',
      email: expert?.email || expert?.contact_email || '',
      phone: expert?.phone || expert?.contact_phone || '',
      location: expert?.location || '',
      bio: expert?.bio || expert?.biography || '',
      specialization: expert?.specialization || '',
      experience_years: expert?.experience_years || 0,
      hourly_rate: expert?.hourly_rate || 0
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileImageCard
          expert={expert}
          name={formData.name}
          experienceYears={formData.experience_years}
        />

        <PersonalInformationCard
          formData={formData}
          isEditing={isEditing}
          onFormDataChange={setFormData}
        />

        <ProfessionalDetailsCard
          formData={formData}
          isEditing={isEditing}
          onFormDataChange={setFormData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
