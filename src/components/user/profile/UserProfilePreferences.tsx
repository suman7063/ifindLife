
import React, { useState } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfilePreferencesProps {
  profile: UserProfile;
}

const UserProfilePreferences: React.FC<UserProfilePreferencesProps> = ({ profile }) => {
  const { updateProfile } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [currency, setCurrency] = useState(profile.currency || 'EUR');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdatePreferences = async () => {
    if (!updateProfile) {
      toast.error('Update function not available');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const success = await updateProfile({
        currency
      });
      
      if (success) {
        toast.success('Preferences updated successfully');
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('An error occurred while updating your preferences');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about appointments and updates via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-0.5">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about appointments and updates via SMS
            </p>
          </div>
          <Switch
            id="sms-notifications"
            checked={smsNotifications}
            onCheckedChange={setSmsNotifications}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Currency Settings</h3>
        
        <div className="flex flex-col space-y-2 max-w-sm">
          <Label htmlFor="currency-selector">Preferred Currency</Label>
          <Select 
            value={currency} 
            onValueChange={setCurrency}
          >
            <SelectTrigger id="currency-selector">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
              <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            This currency will be used for displaying prices and for wallet transactions
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleUpdatePreferences}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Save Preferences'}
      </Button>
    </div>
  );
};

export default UserProfilePreferences;
