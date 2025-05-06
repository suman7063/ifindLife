
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const SettingsTab: React.FC = () => {
  const { expertProfile, updateExpertProfile } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // This would be implemented with actual notification preferences
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control how you receive notifications about appointments and messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveNotifications} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email-notifications"
                  type="checkbox"
                  className="w-4 h-4"
                  defaultChecked
                />
                <Label htmlFor="email-notifications">Receive email notifications</Label>
              </div>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
