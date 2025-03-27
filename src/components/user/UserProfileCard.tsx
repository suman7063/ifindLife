
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase';
import { User as UserIcon, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PasswordChangeModal from './PasswordChangeModal';

interface UserProfileCardProps {
  userProfile: UserProfile | null;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userProfile }) => {
  const navigate = useNavigate();

  if (!userProfile) return null;

  // Generate initials for the avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 border-2 border-ifind-aqua/20">
          <AvatarImage src={userProfile.profilePicture} alt={userProfile.name || 'User'} />
          <AvatarFallback className="text-xl bg-ifind-aqua/10 text-ifind-teal">
            {getInitials(userProfile.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold">{userProfile.name || 'User'}</h3>
          {userProfile.email && (
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
              <Mail className="h-3.5 w-3.5 mr-1" />
              <span>{userProfile.email}</span>
            </div>
          )}
          {(userProfile.city || userProfile.country) && (
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>
                {[userProfile.city, userProfile.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {userProfile.phone && (
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
              <Phone className="h-3.5 w-3.5 mr-1" />
              <span>{userProfile.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => navigate('/user-profile-edit')}
            className="bg-ifind-aqua hover:bg-ifind-teal transition-colors flex-1 flex items-center justify-center"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          
          <PasswordChangeModal />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
