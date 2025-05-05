
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import ProfilePictureCard from './profile/ProfilePictureCard';
import PersonalInfoForm from './profile/PersonalInfoForm';

interface UserProfileManagementProps {
  user: UserProfile | null;
}

const UserProfileManagement: React.FC<UserProfileManagementProps> = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    currency: 'USD'
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        currency: user.currency || 'USD'
      });
    }
  }, [user]);

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <ProfilePictureCard user={user} />
      <PersonalInfoForm 
        user={user} 
        profileData={profileData} 
        setProfileData={setProfileData} 
      />
    </div>
  );
};

export default UserProfileManagement;
