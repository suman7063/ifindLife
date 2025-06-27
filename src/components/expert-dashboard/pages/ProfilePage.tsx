
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpertRepository } from '@/repositories/expertRepository';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { expertProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (data: any) => {
    if (!expertProfile?.id) return;

    setLoading(true);
    try {
      const result = await ExpertRepository.update(expertProfile.id, data);
      if (result) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!expertProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>No expert profile found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expert Profile</h1>
        <p className="text-gray-600 mt-1">Manage your professional profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your professional details and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-lg">{expertProfile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p>{expertProfile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Specialization</label>
              <p>{expertProfile.specialization || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Experience</label>
              <p>{expertProfile.experience || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <p>{expertProfile.bio || 'No bio provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="capitalize">{expertProfile.status}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={() => handleUpdateProfile({})} 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
