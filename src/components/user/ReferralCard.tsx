
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase';
import ReferralHeader from './referral/ReferralHeader';
import ReferralCodeSection from './referral/ReferralCodeSection';
import ShareableLinkSection from './referral/ShareableLinkSection';
import CustomLinkSection from './referral/CustomLinkSection';
import RewardsSection from './referral/RewardsSection';
import ShareButtons from './referral/ShareButtons';
import ReferralFooter from './referral/ReferralFooter';
import { useReferral } from './referral/useReferral';
import { copyReferralLink } from '@/utils/referralUtils';

interface ReferralCardProps {
  userProfile: UserProfile;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ userProfile }) => {
  const {
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
  } = useReferral(userProfile);

  const handleCopyReferralCode = () => {
    if (userProfile.referralCode) {
      copyReferralLink(userProfile.referralCode);
    }
  };

  if (!userProfile.referralCode) {
    return (
      <Card className="mb-6">
        <ReferralHeader isActive={false} />
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-ifind-aqua/20">
      <ReferralHeader isActive={true} />

      <CardContent className="pt-6 space-y-4">
        <ReferralCodeSection 
          referralCode={userProfile.referralCode} 
          onCopyReferralCode={handleCopyReferralCode} 
        />

        <ShareableLinkSection 
          referralLink={referralLink} 
          onCopyLink={handleCopyLink} 
        />

        <CustomLinkSection 
          customText={customText}
          onCustomTextChange={handleCustomTextChange}
          onGetCustomLink={handleCustomLink}
          isGettingLink={isGettingLink}
        />

        {settings && <RewardsSection settings={settings} />}

        <ShareButtons 
          onEmailShare={handleEmailShare}
          onWhatsAppShare={handleWhatsAppShare}
          onTwitterShare={handleTwitterShare}
        />
      </CardContent>

      <ReferralFooter settings={settings} />
    </Card>
  );
};

export default ReferralCard;
