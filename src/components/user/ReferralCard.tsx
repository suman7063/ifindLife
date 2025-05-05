
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile } from "@/types/supabase/user";
import { ReferralSettings } from "@/types/supabase/referral";

interface ReferralCardProps {
  userProfile: UserProfile | null;
  settings: ReferralSettings | null;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ userProfile, settings }) => {
  const [copied, setCopied] = useState(false);
  
  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Your referral information is loading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-slate-100 animate-pulse rounded-md"></div>
          <div className="h-10 bg-slate-100 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Use referral code from user profile, or generate a fallback
  const referralCode = userProfile.referral_code || 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Generate referral link
  const referralLink = window.location.origin + `/signup?ref=${referralCode}`;
  
  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`${type === 'code' ? 'Referral code' : 'Referral link'} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };
  
  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join iFindLife!',
        text: `Use my referral code ${referralCode} to join iFindLife and get a bonus!`,
        url: referralLink,
      }).catch(console.error);
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };
  
  const referrerReward = settings?.referrer_reward || 10;
  const referredReward = settings?.referred_reward || 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
        <CardDescription>
          Share this code with friends and you'll both earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input 
            value={referralCode} 
            readOnly 
            className="font-mono text-center"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => copyToClipboard(referralCode, 'code')}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <Button className="w-full" onClick={shareReferral}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Invitation
        </Button>
        
        <div className="text-sm text-muted-foreground mt-4 border-t pt-4">
          <p className="mb-2">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Share your unique code with friends</li>
            <li>When they sign up & complete their first session, you get ${referrerReward}</li>
            <li>They receive ${referredReward} credit to their account</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
