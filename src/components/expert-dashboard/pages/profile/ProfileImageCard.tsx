
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Star } from 'lucide-react';
import { ExpertProfile } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProfileImageCardProps {
  expert: ExpertProfile | null;
  name: string;
  experienceYears: number;
}

const ProfileImageCard: React.FC<ProfileImageCardProps> = ({
  expert,
  name,
  experienceYears
}) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !expert) return;

    setIsUploadingImage(true);
    try {
      // Upload image to storage
      const fileName = `expert-${expert.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Update expert profile with new image URL
      const { error: updateError } = await supabase
        .from('experts')
        .update({ profile_picture: fileName })
        .eq('id', expert.id);
        
      if (updateError) throw updateError;
      
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage 
              src={expert?.profile_picture || ''} 
              alt={name || 'Expert'} 
            />
            <AvatarFallback className="text-lg">
              {getInitials(name || 'E')}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="profile-image" className="absolute bottom-0 right-0 cursor-pointer">
            <div className="bg-primary text-white p-1 rounded-full">
              <Camera className="w-4 h-4" />
            </div>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
            />
          </label>
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">{name || 'Expert Name'}</h3>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">
              {experienceYears} years experience
            </Badge>
            {expert?.status === 'approved' && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Verified Expert
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {expert?.average_rating || 0} ({expert?.reviews_count || 0} reviews)
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => document.getElementById('profile-image')?.click()}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? 'Uploading...' : 'Change Photo'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileImageCard;
