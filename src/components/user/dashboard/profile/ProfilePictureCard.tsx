
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/database/unified';

interface ProfilePictureCardProps {
  user: UserProfile | null;
}

const ProfilePictureCard: React.FC<ProfilePictureCardProps> = ({ user }) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  return (
    <Card className="col-span-1">
      <CardContent className="p-6 flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
        <p className="text-muted-foreground text-sm mb-4">Update your profile photo</p>
        
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-purple-400 flex items-center justify-center">
          {user?.profile_picture ? (
            <Avatar className="w-full h-full">
              <AvatarImage src={user.profile_picture} alt={user.name || 'Profile'} />
              <AvatarFallback className="text-4xl font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
  );
};

export default ProfilePictureCard;
