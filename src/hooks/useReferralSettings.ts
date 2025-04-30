
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { ReferralSettings } from "@/types/supabase";
import { toast } from "sonner";

export const useReferralSettings = () => {
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
    fetchSettings();
  }, []);

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

  const saveSettings = async () => {
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

  const updateSetting = <T extends keyof ReferralSettings>(
    name: T, 
    value: ReferralSettings[T]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    errors,
    updateSetting,
    saveSettings
  };
};
