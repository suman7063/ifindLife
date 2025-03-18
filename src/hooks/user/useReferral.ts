
import { useState, useEffect } from 'react';
import { ReferralUI, ReferralSettings, ReferralSettingsUI } from '@/types/supabase';
import { fetchReferralSettings, fetchUserReferrals } from '@/utils/referralUtils';
import { adaptReferralSettingsToUI } from '@/utils/dataAdapters';

export const useReferral = (userId?: string) => {
  const [referrals, setReferrals] = useState<ReferralUI[]>([]);
  const [settings, setSettings] = useState<ReferralSettingsUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load referral settings
        const settingsData = await fetchReferralSettings();
        if (settingsData) {
          setSettings(adaptReferralSettingsToUI(settingsData));
        }
        
        // Load user referrals if userId provided
        if (userId) {
          const referralsData = await fetchUserReferrals(userId);
          setReferrals(referralsData);
        }
      } catch (err: any) {
        console.error('Error loading referral data:', err);
        setError(err.message || 'Failed to load referral data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);
  
  return {
    referrals,
    settings,
    loading,
    error,
  };
};
