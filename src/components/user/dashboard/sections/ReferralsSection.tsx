
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile } from '@/types/database/unified';
import { Copy, Share2, Users, User, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ReferralsSectionProps {
  user: UserProfile | null;
}

interface ReferralSettings {
  referrer_reward: number;
  referred_reward: number;
}

const ReferralsSection: React.FC<ReferralsSectionProps> = ({ user }) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        // Get referral settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('type', 'referral')
          .single();
        
        if (settingsData) {
          setSettings({
            referrer_reward: settingsData.value?.referrer_reward || 10,
            referred_reward: settingsData.value?.referred_reward || 5
          });
        }
        
        // Get user's referrals
        const { data: referralsData } = await supabase
          .from('users')
          .select('id, name, email, created_at')
          .eq('referred_by', user.id);
        
        if (referralsData) {
          setReferrals(referralsData);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [user?.id]);

  // Generate referral code from user profile or create a random one
  const referralCode = user?.referral_code || 
    (user?.id ? `REF-${user.id.substring(0, 6).toUpperCase()}` : 'LOADING');
  
  // Generate referral link
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
  
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
  
  const shareReferral = async () => {
    const shareText = `Join iFindLife using my referral code ${referralCode} and get ₹${settings?.referred_reward || 5} in your wallet!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join iFindLife',
          text: shareText,
          url: referralLink,
        });
        toast.success('Referral link shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        // If sharing fails, fall back to copying the link
        copyToClipboard(referralLink, 'link');
      }
    } else {
      // If Web Share API is not available, copy the link to clipboard
      copyToClipboard(referralLink, 'link');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Referral Program</CardTitle>
          </div>
          <CardDescription>
            Invite friends and earn rewards when they sign up and use our services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Your Referral Code</h3>
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
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="font-semibold text-lg mt-4 mb-2">Share Your Link</h3>
            <div className="flex items-center gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(referralLink, 'link')}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={shareReferral} className="w-full mt-4">
              <Share2 className="mr-2 h-4 w-4" />
              Share Your Referral
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start space-x-2">
                <Gift className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium">You Earn</h4>
                  <p className="text-lg font-bold text-green-600">₹{settings?.referrer_reward || 10}</p>
                  <p className="text-sm text-muted-foreground">For each friend who signs up and uses our services</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-2">
                <Gift className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium">Your Friend Earns</h4>
                  <p className="text-lg font-bold text-blue-600">₹{settings?.referred_reward || 5}</p>
                  <p className="text-sm text-muted-foreground">When they sign up using your referral code</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-4">Your Referrals</h3>
            {loading ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading referrals...</p>
              </div>
            ) : referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-muted rounded-lg">
                <p className="text-muted-foreground">You haven't referred anyone yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsSection;
