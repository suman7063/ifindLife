
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileSettingsProps {
  user?: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="font-medium text-xs">{user?.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
