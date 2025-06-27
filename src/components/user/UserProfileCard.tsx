
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/database/unified';
import { getProfilePicture, adaptUserProfile } from '@/utils/userProfileAdapter';
import { Edit, Wallet } from 'lucide-react';

interface UserProfileCardProps {
  user: UserProfile;
  onEdit?: () => void;
  onWalletClick?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  user, 
  onEdit, 
  onWalletClick 
}) => {
  const adaptedUser = adaptUserProfile(user);
  const profilePicture = getProfilePicture(adaptedUser);

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profilePicture} alt={adaptedUser.name} />
              <AvatarFallback className="text-lg">
                {getInitials(adaptedUser.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{adaptedUser.name}</CardTitle>
              <CardDescription>{adaptedUser.email}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{adaptedUser.city}, {adaptedUser.country}</Badge>
                <Badge variant="outline">{adaptedUser.currency}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
            {onWalletClick && (
              <Button variant="outline" size="sm" onClick={onWalletClick}>
                <Wallet className="h-4 w-4 mr-2" />
                ${adaptedUser.wallet_balance.toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p>{adaptedUser.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member Since</p>
            <p>{new Date(adaptedUser.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Favorite Experts</p>
            <p>{adaptedUser.favorite_experts.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Favorite Programs</p>
            <p>{adaptedUser.favorite_programs.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
