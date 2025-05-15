
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserProfileForm from './UserProfileForm';
import UserProfileSummary from './UserProfileSummary';
import UserProfileSecurity from './UserProfileSecurity';
import UserProfilePreferences from './UserProfilePreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, User, Shield, Settings } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { userProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Loading your profile data...</CardDescription>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/user-login'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              View and manage your personal information
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(prev => !prev)}
          >
            {isEditing ? 'Cancel' : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <UserProfileForm 
              profile={userProfile} 
              onComplete={() => setIsEditing(false)} 
            />
          ) : (
            <UserProfileSummary profile={userProfile} />
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="preferences">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <User className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfilePreferences profile={userProfile} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfileSecurity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
