
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface UserProfileSummaryProps {
  profile: UserProfile;
}

const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({ profile }) => {
  // Format created date
  const formattedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.profile_picture} alt={profile.name} />
          <AvatarFallback className="text-lg">{getInitials(profile.name || 'User')}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{profile.name || 'User'}</h3>
          <p className="text-muted-foreground">{profile.email}</p>
          <p className="text-sm text-muted-foreground">Member since {formattedDate}</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{profile.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{profile.city && profile.country ? `${profile.city}, ${profile.country}` : 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currency</p>
              <p>{profile.currency || 'USD'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
              <p>{profile.currency} {profile.wallet_balance.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSummary;
