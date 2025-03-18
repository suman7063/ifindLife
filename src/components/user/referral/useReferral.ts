
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';
import { 
  getReferralSettings, 
  getReferralLink, 
  copyReferralLink 
} from '@/utils/referralUtils';

export const useReferral = (userProfile: UserProfile) => {
  const [settings, setSettings] = useState<any>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isGettingLink, setIsGettingLink] = useState<boolean>(false);

  const fetchSettings = async () => {
    const data = await getReferralSettings();
    setSettings(data);
  };

  const fetchReferralLink = () => {
    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      setReferralLink(link);
    }
  };

  // Initialize when component mounts
  if (!settings && userProfile?.id) {
    fetchSettings();
  }

  if (!referralLink && userProfile?.referralCode) {
    fetchReferralLink();
  }

  // Event handlers
  const handleCopyLink = async () => {
    if (userProfile?.referralCode) {
      const success = await copyReferralLink(userProfile.referralCode);
      if (success) {
        toast.success('Referral link copied to clipboard!');
      } else {
        toast.error('Failed to copy referral link.');
      }
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
  };

  const handleCustomLink = () => {
    setIsGettingLink(true);
    
    setTimeout(() => {
      if (userProfile?.referralCode) {
        const link = getReferralLink(userProfile.referralCode);
        const fullText = customText ? 
          `${customText}\n\nJoin me using my referral link: ${link}` :
          `Join me using my referral link: ${link}`;
          
        try {
          navigator.clipboard.writeText(fullText);
          toast.success('Custom message copied to clipboard!');
        } catch (error) {
          toast.error('Failed to copy message.');
        }
      }
      setIsGettingLink(false);
    }, 1000);
  };

  const handleEmailShare = () => {
    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      const subject = 'Join me on iFind Life!';
      const body = `I'm using iFind Life for my health and wellness needs. Join me using my referral link: ${link}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleWhatsAppShare = () => {
    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      const text = `I'm using iFind Life for my health and wellness needs. Join me using my referral link: ${link}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleTwitterShare = () => {
    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      const text = `I'm using iFind Life for my health and wellness needs. Join me using my referral link: ${link}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
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
