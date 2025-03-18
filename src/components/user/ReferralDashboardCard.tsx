
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile, ReferralSettings } from '@/types/supabase';
import { fetchReferralSettings, copyReferralLink, getReferralLink } from '@/utils/referralUtils';
import { Link } from 'react-router-dom';
import { Gift, Share, ExternalLink, Copy } from 'lucide-react';

interface ReferralDashboardCardProps {
  userProfile: UserProfile;
}

const ReferralDashboardCard: React.FC<ReferralDashboardCardProps> = ({ userProfile }) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchReferralSettings();
      setSettings(data);
    };
    
    loadSettings();
  }, []);
  
  const handleCopyLink = () => {
    if (userProfile?.referralCode) {
      const link = getReferralLink(userProfile.referralCode);
      copyReferralLink(link);
    }
  };

  if (!userProfile?.referralCode) {
    return (
      <Card className="border-ifind-aqua/10 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Gift className="mr-2 h-5 w-5 text-ifind-aqua" />
            Referral Program
          </CardTitle>
          <CardDescription>Your referral code is not available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-ifind-aqua/10 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Gift className="mr-2 h-5 w-5 text-ifind-aqua" />
          Referral Program
        </CardTitle>
        <CardDescription>Invite friends and earn rewards!</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <span className="text-sm text-gray-500">Your Referral Code</span>
          <div className="flex items-center mt-1">
            <div className="bg-gray-50 px-3 py-1.5 rounded-md font-mono text-sm font-medium flex-grow">
              {userProfile.referralCode}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyLink}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {settings && (
          <div className="rounded-md bg-gradient-to-r from-ifind-teal/5 to-ifind-aqua/5 p-3 grid grid-cols-2 gap-2 text-sm mt-2">
            <div>
              <p className="text-gray-500">You get</p>
              <p className="font-semibold">${settings.referrer_reward}</p>
            </div>
            <div>
              <p className="text-gray-500">Friend gets</p>
              <p className="font-semibold">${settings.referred_reward}</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1">
        <Button asChild className="w-full mt-2" variant="outline">
          <Link to="/referrals">
            <Share className="mr-2 h-4 w-4" />
            Manage Referrals
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralDashboardCard;
