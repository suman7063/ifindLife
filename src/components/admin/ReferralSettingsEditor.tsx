import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ReferralSettingsUI, convertReferralSettingsToUI, convertReferralSettingsToDB } from "@/types/supabase/referrals";

const ReferralSettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<ReferralSettingsUI>({
    id: '',
    referrerReward: 10,
    referredReward: 5,
    active: true,
    description: 'Invite friends and earn rewards when they make their first purchase.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('referral_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching referral settings:', error);
          toast.error('Failed to load referral settings');
        } else if (data) {
          setSettings(convertReferralSettingsToUI(data));
        }
      } catch (error) {
        console.error('Error fetching referral settings:', error);
        toast.error('Failed to load referral settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate inputs
      if (settings.referrerReward < 0 || settings.referredReward < 0) {
        toast.error('Reward values cannot be negative');
        return;
      }

      // Convert UI settings to DB format
      const dbSettings = convertReferralSettingsToDB(settings);

      const { data, error } = await supabase
        .from('referral_settings')
        .upsert(dbSettings)
        .select()
        .single();

      if (error) {
        console.error('Error saving referral settings:', error);
        toast.error('Failed to save referral settings');
      } else {
        toast.success('Referral settings saved successfully');
        if (data) {
          setSettings(convertReferralSettingsToUI(data));
        }
      }
    } catch (error) {
      console.error('Error saving referral settings:', error);
      toast.error('Failed to save referral settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number | boolean = value;
    
    // Convert numeric string values to numbers
    if (name === 'referrerReward' || name === 'referredReward') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading referral settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program Settings</CardTitle>
        <CardDescription>
          Configure rewards for your referral program. These settings determine how many credits
          users receive when participating in the referral program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="active" 
              checked={settings.active} 
              onCheckedChange={handleActiveChange} 
            />
            <Label htmlFor="active" className="font-medium">
              Referral Program Active
            </Label>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referrerReward">Referrer Reward (credits)</Label>
                <Input
                  id="referrerReward"
                  name="referrerReward"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.referrerReward}
                  onChange={handleChange}
                  placeholder="10"
                />
                <p className="text-sm text-muted-foreground">
                  Credits given to users who invite others
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referredReward">Referred User Reward (credits)</Label>
                <Input
                  id="referredReward"
                  name="referredReward"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.referredReward}
                  onChange={handleChange}
                  placeholder="5"
                />
                <p className="text-sm text-muted-foreground">
                  Credits given to new users who sign up via referral
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Program Description</Label>
              <Textarea
                id="description"
                name="description"
                value={settings.description || ''}
                onChange={handleChange}
                placeholder="Describe your referral program"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                This description will be shown to users on the referral page
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralSettingsEditor;
