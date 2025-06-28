
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SettingsSectionProps {
  user?: UserProfile;
  onUpdateProfile?: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  user,
  onUpdateProfile 
}) => {
  const handleToggleChange = async (setting: string, value: boolean) => {
    try {
      toast.success(`${setting} setting updated`);
      // In a real implementation, you would call onUpdateProfile here
    } catch (error) {
      toast.error(`Failed to update ${setting} setting`);
      console.error('Settings update error:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground mb-6">Manage your account preferences</p>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about appointments and messages
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                defaultChecked={true} 
                onCheckedChange={(checked) => handleToggleChange('Email notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages about upcoming appointments
                </p>
              </div>
              <Switch 
                id="sms-notifications" 
                defaultChecked={false}
                onCheckedChange={(checked) => handleToggleChange('SMS notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new programs and promotions
                </p>
              </div>
              <Switch 
                id="marketing-notifications" 
                defaultChecked={true}
                onCheckedChange={(checked) => handleToggleChange('Marketing updates', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsSection;
