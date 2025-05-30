
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Camera, CheckCircle, Clock } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';

const ProfilePage = () => {
  const { expert } = useUnifiedAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'E';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile Management</h1>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Manage your professional profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={expert?.profile_picture} alt={expert?.name} />
                <AvatarFallback className="bg-ifind-teal text-white text-2xl">
                  {getInitials(expert?.name)}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{expert?.name || 'Expert Name'}</h2>
              <p className="text-muted-foreground">{expert?.email}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={expert?.status === 'approved' ? 'default' : 'secondary'}>
                  {expert?.status === 'approved' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Expert
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      {expert?.status || 'Pending'}
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Specialization</label>
              <p className="text-muted-foreground">{expert?.specialization || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Experience</label>
              <p className="text-muted-foreground">{expert?.experience || 'Not specified'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Bio</label>
              <p className="text-muted-foreground">{expert?.bio || 'No bio provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
