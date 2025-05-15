
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase/user';
import { useAuth } from '@/contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/getInitials';

interface ProfileSettingsProps {
  user: UserProfile;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const { updateProfile, updateProfilePicture } = useAuth();
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [country, setCountry] = useState(user.country || '');
  const [city, setCity] = useState(user.city || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user.profile_picture || null);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      const success = await updateProfile({
        name,
        phone,
        country,
        city
      });
      
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.includes('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      if (updateProfilePicture) {
        const url = await updateProfilePicture(file);
        if (url) {
          setProfileImage(url);
          toast.success('Profile picture updated successfully');
        } else {
          toast.error('Failed to update profile picture');
        }
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('An error occurred while updating your profile picture');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImage || undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="picture" className="cursor-pointer text-sm font-medium text-blue-600">
                Change Picture
                <Input 
                  id="picture" 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                />
              </Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your full name"
                disabled={isUpdating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email || ''} 
                disabled={true}
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Your phone number"
                disabled={isUpdating}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  placeholder="Your country"
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="Your city"
                  disabled={isUpdating}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;
