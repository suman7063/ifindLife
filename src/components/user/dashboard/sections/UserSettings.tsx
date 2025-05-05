
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Shield } from 'lucide-react';
import UserProfileManagement from '../UserProfileManagement';

interface UserSettingsProps {
  user: UserProfile | null;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Profile Management</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <UserProfileManagement user={user} />
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-medium">Security Settings</h3>
            </div>
            <p className="text-muted-foreground text-center py-4">
              Security settings will be implemented in a future update.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-medium">Preferences</h3>
            </div>
            <p className="text-muted-foreground text-center py-4">
              Preference settings will be implemented in a future update.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
