
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { ReferralSettings } from '@/types/supabase';

interface FormErrors {
  referrer_reward?: string;
  referred_reward?: string;
  description?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch settings from the database
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching referral settings:', error);
        toast.error('Failed to load settings', {
          description: 'Could not retrieve referral program settings'
        });
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching referral settings:', error);
      toast.error('Failed to load settings', {
        description: 'Could not retrieve referral program settings'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Validate form before submitting
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
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

  // Update a specific setting
  const updateSetting = <T extends keyof ReferralSettings>(name: T, value: ReferralSettings[T]) => {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Save settings to the database
  const saveSettings = async () => {
    if (!validateForm()) {
      toast.error('Validation failed', {
        description: 'Please fix the errors before saving'
      });
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
        toast.error('Save failed', {
          description: 'Could not save referral settings to the database'
        });
      } else {
        toast.success('Settings saved', {
          description: 'Referral program settings saved successfully'
        });
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Error saving referral settings:', error);
      toast.error('Save failed', {
        description: 'An error occurred while saving settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Refresh settings from the database
  const refreshSettings = () => {
    fetchSettings();
    toast.info('Refreshing settings', {
      description: 'Fetching the latest referral program settings'
    });
  };

  return {
    settings,
    isLoading,
    isSaving,
    errors,
    updateSetting,
    saveSettings,
    refreshSettings
  };
};
