
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/UserAuthContext';
import ProfilePictureSection from './ProfilePictureSection';
import PersonalInfoSection from './PersonalInfoSection';
import LocationSection from './LocationSection';
import { Button } from '@/components/ui/button';

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

const UserProfileForm: React.FC = () => {
  const { currentUser, updateProfile } = useUserAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || '',
    city: currentUser?.city || '',
  });

  // Update form data when user data changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        country: currentUser.country || '',
        city: currentUser.city || '',
      });
    }
  }, [currentUser]);

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
      const success = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city
      });
      
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfilePictureSection />
      
      <div className="space-y-4">
        <PersonalInfoSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <LocationSection 
          formData={formData} 
          handleChange={handleChange}
          handleCountryChange={handleCountryChange}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ifind-aqua hover:bg-ifind-teal transition-colors"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Updating...
          </span>
        ) : (
          'Update Profile'
        )}
      </Button>
    </form>
  );
};

export default UserProfileForm;
