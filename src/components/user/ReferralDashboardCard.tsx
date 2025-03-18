
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Share2, Twitter, Facebook, Copy, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile, ReferralSettings as ReferralSettingsUI } from '@/types/supabase';
import { fetchReferralSettings, shareViaFacebook, shareViaTwitter, shareViaWhatsApp, shareViaEmail, getReferralLink, copyReferralLink } from '@/utils/referralUtils';
import { useUserAuth } from '@/hooks/useUserAuth';

interface ReferralDashboardCardProps {
  userProfile: UserProfile | null;
}

const ReferralDashboardCard: React.FC<ReferralDashboardCardProps> = ({ userProfile }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [referralSettings, setReferralSettings] = useState<ReferralSettingsUI | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchReferralSettings();
      setReferralSettings(settings);
    };
    
    loadSettings();
  }, []);

  const referralLink = userProfile?.referralCode ? getReferralLink(userProfile.referralCode) : '';
  
  const handleCopyLink = () => {
    copyReferralLink(referralLink);
  };
  
  const handleShareViaTwitter = () => {
    if (userProfile?.referralCode) {
      shareViaTwitter(userProfile.referralCode);
    }
  };
  
  const handleShareViaFacebook = () => {
    if (userProfile?.referralCode) {
      shareViaFacebook(userProfile.referralCode);
    }
  };
  
  const handleShareViaWhatsApp = () => {
    if (userProfile?.referralCode) {
      shareViaWhatsApp(userProfile.referralCode);
    }
  };
  
  const handleShareViaEmail = () => {
    if (userProfile?.referralCode) {
      shareViaEmail(userProfile.referralCode);
    }
  };

  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Users className="mr-2 h-4 w-4 text-ifind-aqua" />
          Referral Program
        </CardTitle>
        <Share2 className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{userProfile?.referralCode || 'No code yet'}</div>
        <p className="text-xs text-gray-500 mb-4">
          Invite friends and earn rewards. You get {referralSettings?.referrerReward} credits when someone joins!
        </p>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="text-sm" 
            />
            <Button 
              size="icon" 
              variant="outline"
              onClick={handleCopyLink}
              title="Copy referral link"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">Share via</div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full hover:bg-blue-50 hover:text-blue-600"
              onClick={handleShareViaTwitter}
              title="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full hover:bg-blue-100 hover:text-blue-800"
              onClick={handleShareViaFacebook}
              title="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full hover:bg-green-50 hover:text-green-600"
              onClick={handleShareViaWhatsApp}
              title="Share via WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full hover:bg-red-50 hover:text-red-600"
              onClick={handleShareViaEmail}
              title="Share via Email"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-500">
          Your friend gets {referralSettings?.referredReward} credits too!
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralDashboardCard;
