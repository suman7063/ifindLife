
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';
import ProfilePictureCard from './profile/ProfilePictureCard';
import PersonalInfoForm from './profile/PersonalInfoForm';

// Remove the user prop and get data directly from auth context
const UserProfileManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const user = ensureUserProfileCompatibility(userProfile);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    currency: 'EUR'
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
        currency: user.currency || 'EUR'
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
