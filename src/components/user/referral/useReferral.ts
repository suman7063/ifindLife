
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { ReferralSettingsUI } from '@/types/supabase/referrals';
import { 
  fetchReferralSettings, 
  getReferralLink, 
  copyReferralLink,
  shareViaEmail,
  shareViaWhatsApp,
  shareViaTwitter
} from '@/utils/referralUtils';

export const useReferral = (userProfile: UserProfile) => {
  const [settings, setSettings] = useState<ReferralSettingsUI | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isGettingLink, setIsGettingLink] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchReferralSettings();
      setSettings(data);
    };

    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      setReferralLink(link);
    }

    loadSettings();
  }, [userProfile]);

  const handleCopyLink = () => {
    copyReferralLink(referralLink);
  };

  const handleEmailShare = () => {
    shareViaEmail(userProfile.referralCode || '', userProfile.name);
  };

  const handleWhatsAppShare = () => {
    shareViaWhatsApp(userProfile.referralCode || '', userProfile.name);
  };

  const handleTwitterShare = () => {
    shareViaTwitter(userProfile.referralCode || '');
  };

  const handleCustomLink = () => {
    setIsGettingLink(true);
    
    // Generate personalized link with custom text
    let customLink = referralLink;
    if (customText.trim()) {
      // Replace spaces with hyphens for URL, make lowercase
      const urlFriendlyText = customText.trim().toLowerCase().replace(/\s+/g, '-');
      customLink = `${window.location.origin}/r/${urlFriendlyText}?ref=${userProfile.referralCode}`;
    }
    
    copyReferralLink(customLink);
    setIsGettingLink(false);
  };

  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
  };

  return {
    settings,
    referralLink,
    customText,
    isGettingLink,
    handleCopyLink,
    handleEmailShare,
    handleWhatsAppShare,
    handleTwitterShare,
    handleCustomLink,
    handleCustomTextChange,
  };
};
