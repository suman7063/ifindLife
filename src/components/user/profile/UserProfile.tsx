
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/getInitials';

interface Props {
  user?: any;
  currentUser?: any;
  [key: string]: any;
}

const UserProfile: React.FC<Props> = (props) => {
  const { userProfile, isLoading } = useAuth();
  
  const user = props.user || userProfile;
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No user profile found</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_picture || user.profilePicture} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-lg">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Country</label>
            <p className="text-lg">{user.country || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">City</label>
            <p className="text-lg">{user.city || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Wallet Balance</label>
            <p className="text-lg">${user.wallet_balance || user.walletBalance || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
