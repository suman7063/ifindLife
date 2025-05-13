
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types/supabase';

interface UserProfileCardProps {
  userProfile?: UserProfile | null;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userProfile }) => {
  const { currentUser } = useUserAuth();
  
  // Use provided userProfile or fall back to the currentUser from context
  const userData = userProfile || currentUser;

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Profile</CardTitle>
          <Link to="/user-profile-edit">
            <Button variant="outline" size="sm" className="flex items-center">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-shrink-0">
            {userData.profile_picture ? (
              <img
                src={userData.profile_picture}
                alt={userData.name || 'User'}
                className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-medium">{userData.name || 'User'}</h3>
            <p className="text-muted-foreground">{userData.email}</p>
            {userData.phone && (
              <p className="text-muted-foreground">{userData.phone}</p>
            )}
            {userData.country && (
              <p className="text-muted-foreground">
                {userData.city ? `${userData.city}, ` : ''}{userData.country}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
