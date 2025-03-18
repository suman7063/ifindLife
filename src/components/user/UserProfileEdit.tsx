
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/hooks/useUserAuth';
import ProfilePictureUploader from '../common/ProfilePictureUploader';
import PersonalInfoSection from './form/PersonalInfoSection';
import LocationSection from './form/LocationSection';

const UserProfileEdit: React.FC = () => {
  const { currentUser, updateProfile, updateProfilePicture } = useUserAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || '',
    city: currentUser?.city || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await updateProfilePicture(file);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  if (!currentUser) return null;

  // Use the profilePicture property from UserProfile
  const currentImage = currentUser.profilePicture;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <ProfilePictureUploader
              currentImage={currentImage}
              onImageUpload={handleImageUpload}
              name={currentUser.name || ''}
            />
          </div>
          
          <PersonalInfoSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <LocationSection 
            formData={formData} 
            handleChange={handleChange}
            handleCountryChange={handleCountryChange}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileEdit;
