
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ReferralSettings } from "@/types/supabase";

const ReferralSettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<ReferralSettings & { 
    currency?: string;
    referrer_reward_inr?: number;
    referrer_reward_eur?: number;
    referred_reward_inr?: number;
    referred_reward_eur?: number;
  }>({
    id: '',
    referrer_reward: 10,
    referred_reward: 5,
    referrer_reward_inr: 10,
    referrer_reward_eur: 10,
    referred_reward_inr: 5,
    referred_reward_eur: 5,
    active: true,
    currency: 'INR',
    description: 'Invite friends and earn rewards when they make their first purchase.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    referrer_reward_inr?: string;
    referrer_reward_eur?: string;
    referred_reward_inr?: string;
    referred_reward_eur?: string;
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
          .maybeSingle(); // Use maybeSingle instead of single to handle empty table

        if (error) {
          console.error('Error fetching referral settings:', error);
          // Don't show error if table is empty (first time setup)
          if (error.code !== 'PGRST116') {
            toast.error('Failed to load referral settings');
          }
        } else if (data) {
          // Map database fields to settings
          setSettings({
            id: data.id || '',
            referrer_reward: data.referrer_reward ?? 10,
            referred_reward: data.referred_reward ?? 5,
            referrer_reward_inr: data.referrer_reward_inr ?? data.referrer_reward ?? 10,
            referrer_reward_eur: data.referrer_reward_eur ?? data.referrer_reward ?? 10,
            referred_reward_inr: data.referred_reward_inr ?? data.referred_reward ?? 5,
            referred_reward_eur: data.referred_reward_eur ?? data.referred_reward ?? 5,
            active: data.active ?? false,
            currency: data.currency || 'INR',
            description: data.description || 'Invite friends and earn rewards when they complete their first session.',
            updated_at: data.updated_at
          });
        }
      } catch (error) {
        console.error('Error fetching referral settings:', error);
        // Don't show error if table is empty
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: {
      referrer_reward_inr?: string;
      referrer_reward_eur?: string;
      referred_reward_inr?: string;
      referred_reward_eur?: string;
      description?: string;
    } = {};
    
    if ((settings.referrer_reward_inr ?? 0) < 0) {
      newErrors.referrer_reward_inr = 'Reward cannot be negative';
    }
    
    if ((settings.referrer_reward_eur ?? 0) < 0) {
      newErrors.referrer_reward_eur = 'Reward cannot be negative';
    }
    
    if ((settings.referred_reward_inr ?? 0) < 0) {
      newErrors.referred_reward_inr = 'Reward cannot be negative';
    }
    
    if ((settings.referred_reward_eur ?? 0) < 0) {
      newErrors.referred_reward_eur = 'Reward cannot be negative';
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
      // Prepare settings for upsert
      const updatedSettings: any = {
        id: settings.id || undefined,
        referrer_reward: settings.referrer_reward_inr ?? 10, // Keep for backward compatibility
        referred_reward: settings.referred_reward_inr ?? 5, // Keep for backward compatibility
        referrer_reward_inr: settings.referrer_reward_inr ?? 10,
        referrer_reward_eur: settings.referrer_reward_eur ?? 10,
        referred_reward_inr: settings.referred_reward_inr ?? 5,
        referred_reward_eur: settings.referred_reward_eur ?? 5,
        active: settings.active ?? false,
        currency: settings.currency || 'INR',
        description: settings.description || '',
        updated_at: new Date().toISOString()
      };

      console.log('Saving referral settings:', updatedSettings);

      const { data, error } = await supabase
        .from('referral_settings')
        .upsert(updatedSettings, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving referral settings:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast.error(`Failed to save referral settings: ${error.message}`);
      } else {
        console.log('Settings saved successfully:', data);
        toast.success('Referral settings saved successfully');
        if (data) {
          setSettings(data);
        }
      }
    } catch (error: any) {
      console.error('Error saving referral settings:', error);
      toast.error(`Failed to save referral settings: ${error?.message || 'Unknown error'}`);
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
    if (name === 'referrer_reward' || name === 'referred_reward' || 
        name === 'referrer_reward_inr' || name === 'referrer_reward_eur' ||
        name === 'referred_reward_inr' || name === 'referred_reward_eur') {
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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Referrer Rewards (Credits)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referrer_reward_inr">Referrer Reward (INR) ₹</Label>
                    <Input
                      id="referrer_reward_inr"
                      name="referrer_reward_inr"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.referrer_reward_inr ?? 10}
                      onChange={handleChange}
                      placeholder="10"
                      className={errors.referrer_reward_inr ? "border-red-500" : ""}
                    />
                    {errors.referrer_reward_inr && (
                      <p className="text-red-500 text-xs">{errors.referrer_reward_inr}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Credits given to users who invite others (INR)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referrer_reward_eur">Referrer Reward (EUR) €</Label>
                    <Input
                      id="referrer_reward_eur"
                      name="referrer_reward_eur"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.referrer_reward_eur ?? 10}
                      onChange={handleChange}
                      placeholder="10"
                      className={errors.referrer_reward_eur ? "border-red-500" : ""}
                    />
                    {errors.referrer_reward_eur && (
                      <p className="text-red-500 text-xs">{errors.referrer_reward_eur}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Credits given to users who invite others (EUR)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Referred User Rewards (Credits)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referred_reward_inr">Referred User Reward (INR) ₹</Label>
                    <Input
                      id="referred_reward_inr"
                      name="referred_reward_inr"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.referred_reward_inr ?? 5}
                      onChange={handleChange}
                      placeholder="5"
                      className={errors.referred_reward_inr ? "border-red-500" : ""}
                    />
                    {errors.referred_reward_inr && (
                      <p className="text-red-500 text-xs">{errors.referred_reward_inr}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Credits given to new users who sign up via referral (INR)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referred_reward_eur">Referred User Reward (EUR) €</Label>
                    <Input
                      id="referred_reward_eur"
                      name="referred_reward_eur"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.referred_reward_eur ?? 5}
                      onChange={handleChange}
                      placeholder="5"
                      className={errors.referred_reward_eur ? "border-red-500" : ""}
                    />
                    {errors.referred_reward_eur && (
                      <p className="text-red-500 text-xs">{errors.referred_reward_eur}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Credits given to new users who sign up via referral (EUR)
                    </p>
                  </div>
                </div>
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
