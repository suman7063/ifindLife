import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { useNavigate } from 'react-router-dom';
import UserProfileForm from './profile/UserProfileForm';

const UserProfileEdit: React.FC = () => {
  const { currentUser } = useUserAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Please log in to edit your profile</p>
            <Button onClick={() => navigate('/user-login')} className="mt-4">
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/user-dashboard')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserProfileForm 
          profile={currentUser} 
          onComplete={() => navigate('/user-dashboard')} 
        />
      </CardContent>
    </Card>
  );
};

export default UserProfileEdit;
