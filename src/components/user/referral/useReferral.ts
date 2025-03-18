
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { ReferralSettings } from '@/types/supabase/referrals';
import { 
  getReferralSettings, 
  getReferralLink, 
  copyReferralLink
} from '@/utils/referralUtils';

export const useReferral = (userProfile: UserProfile) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isGettingLink, setIsGettingLink] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getReferralSettings();
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
    const subject = 'Join me on iFindLife';
    const body = `I thought you might be interested in iFindLife. Sign up using my referral code ${userProfile.referralCode} and get credits when you join! ${referralLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleWhatsAppShare = () => {
    const text = `Join me on iFindLife! Sign up using my referral code ${userProfile.referralCode} and get credits when you join: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleTwitterShare = () => {
    const text = `Join me on iFindLife! Sign up using my referral code ${userProfile.referralCode} and get credits when you join: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`);
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
    handleFacebookShare,
    handleCustomLink,
    handleCustomTextChange,
  };
};
