
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ReferralSettings {
  id?: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description: string;
}

interface ReferralErrors {
  referrer_reward?: string;
  referred_reward?: string;
  description?: string;
}

export const useReferralSettings = () => {
  const [settings, setSettings] = useState<ReferralSettings>({
    referrer_reward: 10,
    referred_reward: 5,
    active: true,
    description: 'Invite friends and earn rewards when they complete their first session.',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ReferralErrors>({});

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('referral-settings');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          setSettings(prev => ({ ...prev, ...parsedSettings }));
        }
      } catch (error) {
        console.error('Error loading referral settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const updateSetting = (key: keyof ReferralSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when field is updated
    if (errors[key as keyof ReferralErrors]) {
      setErrors(prev => ({
        ...prev,
        [key]: undefined
      }));
    }
  };

  const validateSettings = (): boolean => {
    const newErrors: ReferralErrors = {};
    
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
    if (!validateSettings()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('referral-settings', JSON.stringify(settings));
      toast.success('Referral settings saved successfully');
    } catch (error) {
      console.error('Error saving referral settings:', error);
      toast.error('Failed to save referral settings');
    } finally {
      setIsSaving(false);
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
