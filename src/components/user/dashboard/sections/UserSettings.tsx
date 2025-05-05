
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Lock, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserSettingsProps {
  user: UserProfile | null;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Change your password to keep your account secure
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Set Up 2FA</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Notification settings coming soon
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Privacy settings coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
