
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ReferralSettings } from "@/types/supabase";

const ReferralSettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<ReferralSettings>({
    id: '',
    referrer_reward: 10,
    referred_reward: 5,
    active: true,
    description: 'Invite friends and earn rewards when they make their first purchase.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    referrer_reward?: string;
    referred_reward?: string;
    description?: string;
  }>({});

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
          setSettings(data);
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

  const validateForm = (): boolean => {
    const newErrors: {
      referrer_reward?: string;
      referred_reward?: string;
      description?: string;
    } = {};
    
    if (settings.referrer_reward < 0) {
      newErrors.referrer_reward = 'Reward cannot be negative';
    }
    
    if (settings.referred_reward < 0) {
      newErrors.referred_reward = 'Reward cannot be negative';
    }
    
    if (!settings.description || settings.description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    try {
      const updatedSettings = {
        id: settings.id || undefined,
        referrer_reward: settings.referrer_reward,
        referred_reward: settings.referred_reward,
        active: settings.active,
        description: settings.description,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('referral_settings')
        .upsert(updatedSettings)
        .select()
        .single();

      if (error) {
        console.error('Error saving referral settings:', error);
        toast.error('Failed to save referral settings');
      } else {
        toast.success('Referral settings saved successfully');
        if (data) {
          setSettings(data);
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
    if (name === 'referrer_reward' || name === 'referred_reward') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setSettings((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleActiveChange = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-aqua"></div>
          </div>
        </CardContent>
      </Card>
    );
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referrer_reward">Referrer Reward (credits)</Label>
                <Input
                  id="referrer_reward"
                  name="referrer_reward"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.referrer_reward}
                  onChange={handleChange}
                  placeholder="10"
                  className={errors.referrer_reward ? "border-red-500" : ""}
                />
                {errors.referrer_reward && (
                  <p className="text-red-500 text-xs">{errors.referrer_reward}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Credits given to users who invite others
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referred_reward">Referred User Reward (credits)</Label>
                <Input
                  id="referred_reward"
                  name="referred_reward"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.referred_reward}
                  onChange={handleChange}
                  placeholder="5"
                  className={errors.referred_reward ? "border-red-500" : ""}
                />
                {errors.referred_reward && (
                  <p className="text-red-500 text-xs">{errors.referred_reward}</p>
                )}
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
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
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
