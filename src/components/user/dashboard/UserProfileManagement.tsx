
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileManagementProps {
  user: UserProfile | null;
}

const UserProfileManagement: React.FC<UserProfileManagementProps> = ({ user }) => {
  const { updateUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate photo upload (will be implemented in future)
    setIsUploadingPhoto(true);
    
    setTimeout(() => {
      toast.success("Profile photo updated");
      setIsUploadingPhoto(false);
    }, 1500);
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Cannot update profile: User ID not found");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const success = await updateUserProfile({
        name: profileData.name,
        phone: profileData.phone,
        country: profileData.country,
        city: profileData.city,
        currency: profileData.currency
      });
      
      if (success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardContent className="p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
          <p className="text-muted-foreground text-sm mb-4">Update your profile photo</p>
          
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-purple-400 flex items-center justify-center">
            {user?.profile_picture ? (
              <Avatar className="w-full h-full">
                <AvatarImage src={user.profile_picture} alt={user.name || 'Profile'} />
                <AvatarFallback className="text-4xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-6xl font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          <Label htmlFor="photo-upload" className="cursor-pointer">
            <div className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              {isUploadingPhoto ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              <span>Upload Photo</span>
            </div>
            <Input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
            />
          </Label>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Personal Information</h3>
          <p className="text-muted-foreground text-sm mb-4">Update your personal details</p>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  value={profileData.email}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Input 
                  id="currency" 
                  name="currency"
                  value={profileData.currency}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileManagement;
