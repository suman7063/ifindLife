
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';

const ProfilePage: React.FC = () => {
  const { expertProfile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expert Profile</h2>
        <p className="text-muted-foreground">Manage your professional information and credentials</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            This information will be displayed publicly to potential clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                <p>{expertProfile?.name || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p>{expertProfile?.email || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                <p>{expertProfile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                <p>
                  {[
                    expertProfile?.city,
                    expertProfile?.state,
                    expertProfile?.country
                  ].filter(Boolean).join(', ') || 'Not provided'}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Specialization</h3>
                <p>{expertProfile?.specialization || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Years of Experience</h3>
                <p>{expertProfile?.experience || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Professional Bio</h3>
              <p className="bg-gray-50 p-3 rounded">{expertProfile?.bio || 'No bio provided. Add a professional bio to help clients understand your background and approach.'}</p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Certifications & Credentials</CardTitle>
          <CardDescription>
            Your professional certifications and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-8 rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">
              Professional certificate management will be available in Phase 2.
            </p>
            <Button variant="outline" disabled>
              Upload Certificates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
