import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile, ReferralSettings } from '@/types/supabase';
import { getReferralLink, copyReferralLink, fetchReferralSettings } from '@/utils/referralUtils';
import { Link } from 'react-router-dom';
import { Gift, Share, Copy } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { toast } from 'sonner';

interface ReferralDashboardCardProps {
  userProfile: UserProfile;
}

const ReferralDashboardCard: React.FC<ReferralDashboardCardProps> = ({ userProfile }) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const { getReferralLink: getUserReferralLink } = useUserAuth();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchReferralSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading referral settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleCopyLink = () => {
    if (!userProfile?.referral_code || isCopying) return;
    
    setIsCopying(true);
    try {
      let link = null;
      
      // First try the context function
      if (typeof getUserReferralLink === 'function') {
        link = getUserReferralLink();
      }
      
      // If that fails, use the utility function
      if (!link) {
        link = getReferralLink(userProfile.referral_code);
      }
      
      if (link) {
        const success = copyReferralLink(link);
        if (success) {
          toast.success('Referral link copied to clipboard!');
        } else {
          toast.error('Failed to copy link');
        }
      }
    } catch (error) {
      console.error('Error copying referral link:', error);
      toast.error('Failed to copy link');
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  // Don't show referral card if program is disabled
  if (settings && !settings.active) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Referral program is currently disabled.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If user doesn't have a referral code, show complete profile message
  if (!userProfile.referral_code) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Complete your profile to get your unique referral code and start earning rewards.
          </p>
          <Button asChild className="w-full">
            <Link to="/profile">Complete Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Share your referral code and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Your Referral Code</p>
                <p className="text-2xl font-bold text-primary">{userProfile.referral_code}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                disabled={isCopying}
                className="ml-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                {isCopying ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>

          {settings && settings.active && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Earn <span className="font-semibold text-primary">${settings.referrer_reward}</span> for each friend you refer</p>
              <p>• Your friends get <span className="font-semibold text-primary">${settings.referred_reward}</span> when they sign up</p>
              {settings.description && (
                <p className="mt-2 italic">"{settings.description}"</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link to="/referrals">Manage Referrals</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralDashboardCard;