
import React from 'react';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProfilePage: React.FC = () => {
  const { expertProfile } = useAuth();

  if (!expertProfile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">No expert profile found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Expert Profile</h1>
        <p className="text-muted-foreground">Manage your expert profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{expertProfile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{expertProfile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p className="text-sm text-muted-foreground">{expertProfile.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <p className="text-sm text-muted-foreground">{expertProfile.specialization || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <p className="text-sm text-muted-foreground">{expertProfile.experience || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <p className="text-sm text-muted-foreground">
                  {[expertProfile.city, expertProfile.state, expertProfile.country]
                    .filter(Boolean)
                    .join(', ') || 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Verification Status</label>
              <div className="mt-1">
                <Badge variant={expertProfile.verified ? 'default' : 'secondary'}>
                  {expertProfile.verified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Account Status</label>
              <div className="mt-1">
                <Badge 
                  variant={
                    expertProfile.status === 'approved' ? 'default' :
                    expertProfile.status === 'pending' ? 'secondary' :
                    'destructive'
                  }
                >
                  {expertProfile.status || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {expertProfile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{expertProfile.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
