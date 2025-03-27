
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile, ReferralSettings } from '@/types/supabase';
import { 
  fetchReferralSettings, 
  getReferralLink, 
  copyReferralLink,
  shareViaEmail,
  shareViaWhatsApp,
  shareViaTwitter
} from '@/utils/referralUtils';
import { Gift, Copy, Share, Mail, Twitter, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralCardProps {
  userProfile: UserProfile;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ userProfile }) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [isGettingLink, setIsGettingLink] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchReferralSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading referral settings:', error);
      }
    };

    if (userProfile?.referralCode) {
      try {
        const link = getReferralLink(userProfile.referralCode);
        setReferralLink(link);
      } catch (error) {
        console.error('Error generating referral link:', error);
      }
    }

    loadSettings();
  }, [userProfile]);

  const handleCopyLink = () => {
    if (isCopying) return;
    
    setIsCopying(true);
    try {
      copyReferralLink(referralLink);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    } finally {
      setIsCopying(false);
    }
  };

  const handleEmailShare = () => {
    try {
      shareViaEmail(userProfile.referralCode || '', userProfile.name);
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast.error('Failed to share via email');
    }
  };

  const handleWhatsAppShare = () => {
    try {
      shareViaWhatsApp(userProfile.referralCode || '', userProfile.name);
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast.error('Failed to share via WhatsApp');
    }
  };

  const handleTwitterShare = () => {
    try {
      shareViaTwitter(userProfile.referralCode || '');
    } catch (error) {
      console.error('Error sharing via Twitter:', error);
      toast.error('Failed to share via Twitter');
    }
  };

  const handleCustomLink = () => {
    if (isGettingLink) return;
    
    setIsGettingLink(true);
    
    try {
      // Generate personalized link with custom text
      if (!customText.trim()) {
        copyReferralLink(referralLink);
        toast.success('Referral link copied to clipboard');
        return;
      }
      
      // Replace spaces with hyphens for URL, make lowercase
      const urlFriendlyText = customText.trim().toLowerCase().replace(/\s+/g, '-');
      const customLink = `${window.location.origin}/r/${urlFriendlyText}?ref=${userProfile.referralCode}`;
      
      copyReferralLink(customLink);
      toast.success('Custom referral link copied to clipboard');
    } catch (error) {
      console.error('Error generating custom link:', error);
      toast.error('Failed to generate custom link');
    } finally {
      setIsGettingLink(false);
    }
  };

  if (!userProfile.referralCode) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-gray-500">Referral Program</CardTitle>
          <CardDescription className="text-center">Your referral code is not available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-ifind-aqua/20">
      <CardHeader className="bg-gradient-to-r from-ifind-teal/10 to-ifind-aqua/10 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-ifind-teal flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Referral Program
          </CardTitle>
          <div className="px-3 py-1 bg-ifind-teal text-white text-xs rounded-full">
            Active
          </div>
        </div>
        <CardDescription>
          Invite friends and earn rewards when they join!
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="referral-code" className="text-gray-500 text-sm">Your Referral Code</Label>
            <div className="flex items-center gap-2">
              <Input id="referral-code" value={userProfile.referralCode} readOnly className="font-mono bg-white" />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyReferralLink(userProfile.referralCode || '')}
                className="min-w-10 shrink-0"
                disabled={isCopying}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="referral-link" className="text-gray-500 text-sm">Shareable Link</Label>
            <div className="flex items-center gap-2">
              <Input id="referral-link" value={referralLink} readOnly className="text-xs sm:text-sm bg-white" />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                className="min-w-10 shrink-0"
                disabled={isCopying}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="custom-text" className="text-gray-500 text-sm">Personalize Your Link</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="custom-text" 
                placeholder="e.g. join-my-community" 
                value={customText} 
                onChange={(e) => setCustomText(e.target.value)}
                disabled={isGettingLink}
              />
              <Button 
                variant="outline" 
                onClick={handleCustomLink}
                disabled={isGettingLink}
                className="whitespace-nowrap"
              >
                {isGettingLink ? 'Getting...' : 'Get Link'}
              </Button>
            </div>
          </div>
        </div>

        {settings && (
          <div className="bg-gradient-to-r from-ifind-teal/5 to-ifind-aqua/5 p-4 rounded-md mt-4">
            <h4 className="text-sm font-medium mb-2 text-ifind-teal">Rewards</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">You receive</p>
                <p className="font-semibold">${settings.referrer_reward.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Your friend receives</p>
                <p className="font-semibold">${settings.referred_reward.toFixed(2)}</p>
              </div>
              <div className="col-span-2 text-xs text-gray-500 mt-1">
                {settings.description || 'Rewards are added to your wallet after your friend makes their first purchase.'}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3 text-gray-600">Share via</h4>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleEmailShare} variant="outline" size="sm" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button onClick={handleWhatsAppShare} variant="outline" size="sm" className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button onClick={handleTwitterShare} variant="outline" size="sm" className="flex items-center">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 py-3 text-xs text-gray-500 justify-center rounded-b-lg">
        {settings?.active ? 
          'Terms & conditions apply. Rewards are subject to verification.' : 
          'Referral program is currently paused.'}
      </CardFooter>
    </Card>
  );
};

export default ReferralCard;
