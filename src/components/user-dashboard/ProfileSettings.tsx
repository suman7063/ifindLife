
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileSettingsProps {
  user?: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{user.full_name || user.name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email || 'Not provided'}</p>
            </div>
            {/* Additional profile fields can be added here */}
          </div>
        ) : (
          <p>Unable to load profile information.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
