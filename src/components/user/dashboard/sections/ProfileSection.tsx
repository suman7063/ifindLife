
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import UserProfileCard from '@/components/user/UserProfileCard';

const ProfileSection = () => {
  const { userProfile } = useSimpleAuth();

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Card>
          <CardContent className="p-6">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <UserProfileCard user={userProfile} />
    </div>
  );
};

export default ProfileSection;
