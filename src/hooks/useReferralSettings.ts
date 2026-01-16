
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ReferralSettings {
  id?: string;
  referrer_reward_inr?: number;
  referrer_reward_eur?: number;
  referred_reward_inr?: number;
  referred_reward_eur?: number;
  active: boolean;
  currency?: string;
  description: string;
}

interface ReferralErrors {
  referrer_reward_inr?: string;
  referrer_reward_eur?: string;
  referred_reward_inr?: string;
  referred_reward_eur?: string;
  description?: string;
}

export const useReferralSettings = () => {
  const [settings, setSettings] = useState<ReferralSettings>({
    referrer_reward_inr: 10,
    referrer_reward_eur: 10,
    referred_reward_inr: 5,
    referred_reward_eur: 5,
    active: true,
    currency: 'INR',
    description: 'Invite friends and earn rewards when they complete their first session.',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ReferralErrors>({});

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Try to get admin session token
        const sessionToken = localStorage.getItem('secure_admin_session_token');
        
        if (sessionToken) {
          // Use admin edge function (bypasses RLS)
          const { data, error } = await supabase.functions.invoke('admin-referral-settings', {
            method: 'GET',
            headers: {
              'x-admin-session-token': sessionToken
            }
          });

          if (error) {
            console.error('Error fetching referral settings:', error);
            // Fallback to direct query if edge function fails
            await loadSettingsDirect();
          } else if (data?.data) {
            const settingsData = data.data;
            setSettings({
              id: settingsData.id || '',
              referrer_reward_inr: settingsData.referrer_reward_inr ?? 10,
              referrer_reward_eur: settingsData.referrer_reward_eur ?? 10,
              referred_reward_inr: settingsData.referred_reward_inr ?? 5,
              referred_reward_eur: settingsData.referred_reward_eur ?? 5,
              active: settingsData.active ?? false,
              currency: settingsData.currency || 'INR',
              description: settingsData.description || 'Invite friends and earn rewards when they complete their first session.',
            });
          } else {
            // No data found, use defaults
          }
        } else {
          // No admin session, try direct query (for public read)
          await loadSettingsDirect();
        }
      } catch (error) {
        console.error('Error loading referral settings:', error);
        // Fallback to direct query
        await loadSettingsDirect();
      } finally {
        setIsLoading(false);
      }
    };

    const loadSettingsDirect = async () => {
      try {
        const { data, error } = await supabase
          .from('referral_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching referral settings:', error);
        } else if (data) {
          // Map database fields to settings
          setSettings({
            id: data.id || '',
            referrer_reward_inr: data.referrer_reward_inr ?? 10,
            referrer_reward_eur: data.referrer_reward_eur ?? 10,
            referred_reward_inr: data.referred_reward_inr ?? 5,
            referred_reward_eur: data.referred_reward_eur ?? 5,
            active: data.active ?? false,
            currency: data.currency || 'INR',
            description: data.description || 'Invite friends and earn rewards when they complete their first session.',
          });
        }
      } catch (err) {
        console.error('Error in loadSettingsDirect:', err);
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

  const saveSettings = async () => {
    if (!validateSettings()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    try {
      // Get admin session token from localStorage
      const sessionToken = localStorage.getItem('secure_admin_session_token');
      
      if (!sessionToken) {
        toast.error('Admin session expired. Please login again.');
        return;
      }

      // Prepare data for database
      const updatedSettings: any = {
        id: settings.id || undefined,
        referrer_reward_inr: settings.referrer_reward_inr ?? 10,
        referrer_reward_eur: settings.referrer_reward_eur ?? 10,
        referred_reward_inr: settings.referred_reward_inr ?? 5,
        referred_reward_eur: settings.referred_reward_eur ?? 5,
        active: settings.active ?? false,
        currency: settings.currency || 'INR',
        description: settings.description || '',
      };

      console.log('Saving referral settings via admin edge function:', updatedSettings);

      // Call admin edge function (uses service role key, bypasses RLS)
      const { data, error } = await supabase.functions.invoke('admin-referral-settings', {
        method: 'POST',
        headers: {
          'x-admin-session-token': sessionToken
        },
        body: updatedSettings
      });

      if (error) {
        console.error('Error saving referral settings:', error);
        toast.error(`Failed to save referral settings: ${error.message}`);
      } else if (data?.error) {
        console.error('Error from edge function:', data.error);
        toast.error(`Failed to save referral settings: ${data.error}`);
      } else if (data?.data) {
        console.log('Settings saved successfully:', data.data);
        // Update local state with saved data
        const savedData = data.data;
        setSettings({
          id: savedData.id || '',
          referrer_reward_inr: savedData.referrer_reward_inr ?? 10,
          referrer_reward_eur: savedData.referrer_reward_eur ?? 10,
          referred_reward_inr: savedData.referred_reward_inr ?? 5,
          referred_reward_eur: savedData.referred_reward_eur ?? 5,
          active: savedData.active ?? false,
          currency: savedData.currency || 'INR',
          description: savedData.description || 'Invite friends and earn rewards when they complete their first session.',
        });
        toast.success('Referral settings saved successfully');
      }
    } catch (error: any) {
      console.error('Error saving referral settings:', error);
      toast.error(`Failed to save referral settings: ${error?.message || 'Unknown error'}`);
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
