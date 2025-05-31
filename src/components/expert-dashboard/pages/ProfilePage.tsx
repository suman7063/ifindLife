
import React, { useState, useEffect } from 'react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';
import { expertRepository } from '@/repositories/expertRepository';
import ProfileHeader from './profile/ProfileHeader';
import ProfileImageCard from './profile/ProfileImageCard';
import PersonalInformationCard from './profile/PersonalInformationCard';
import ProfessionalDetailsCard from './profile/ProfessionalDetailsCard';

const ProfilePage = () => {
  const { expert, setExpert } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    location: '',
    bio: '',
    specialization: '',
    experience_years: 0,
    hourly_rate: 0
  });

  // Load expert data when component mounts or expert changes
  useEffect(() => {
    if (expert) {
      setFormData({
        name: expert.name || '',
        email: expert.email || '',
        phone: expert.phone || '',
        address: expert.address || '',
        city: expert.city || '',
        state: expert.state || '',
        country: expert.country || '',
        location: `${expert.city || ''}, ${expert.state || ''}, ${expert.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ','),
        bio: expert.bio || '',
        specialization: expert.specialization || '',
        experience_years: parseInt(expert.experience || '0') || 0,
        hourly_rate: expert.hourly_rate || 0
      });
    }
  }, [expert]);

  const handleSave = async () => {
    if (!expert?.id) {
      toast.error('No expert profile found');
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare update data
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        bio: formData.bio,
        specialization: formData.specialization,
        experience: formData.experience_years.toString(),
        hourly_rate: formData.hourly_rate
      };

      const success = await expertRepository.updateExpert(expert.id, updateData);
      
      if (success) {
        // Update local expert state
        const updatedExpert = { ...expert, ...updateData };
        setExpert(updatedExpert);
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original expert data
    if (expert) {
      setFormData({
        name: expert.name || '',
        email: expert.email || '',
        phone: expert.phone || '',
        address: expert.address || '',
        city: expert.city || '',
        state: expert.state || '',
        country: expert.country || '',
        location: `${expert.city || ''}, ${expert.state || ''}, ${expert.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ','),
        bio: expert.bio || '',
        specialization: expert.specialization || '',
        experience_years: parseInt(expert.experience || '0') || 0,
        hourly_rate: expert.hourly_rate || 0
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={handleSave}
        isSaving={isSaving}
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
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
