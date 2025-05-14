
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Camera } from 'lucide-react';
import { UserProfile } from '@/types/supabase/user';
import { getProfilePicture } from '@/utils/userProfileAdapter';

interface UserProfileCardProps {
  user: UserProfile | null;
  onEdit?: () => void;
  onImageUpload?: () => void;
  isLoading?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onEdit,
  onImageUpload,
  isLoading = false
}) => {
  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">
            No user profile found.
          </div>
        </CardContent>
      </Card>
    );
  }

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  // Use the helper function to get profile picture consistently
  const profilePictureUrl = getProfilePicture(user);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePictureUrl} alt={user.name || 'User'} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            
            {onImageUpload && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={onImageUpload}
                disabled={isLoading}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-medium text-lg">{user.name || 'User'}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-muted-foreground text-xs">Location</p>
              <p className="font-medium">
                {user.city && user.country
                  ? `${user.city}, ${user.country}`
                  : user.country || 'Not set'}
              </p>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-muted-foreground text-xs">Wallet</p>
              <p className="font-medium">
                {user.currency || '$'} {user.wallet_balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {onEdit && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={onEdit}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
