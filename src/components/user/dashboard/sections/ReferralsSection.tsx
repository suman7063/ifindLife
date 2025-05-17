
import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Gift, Users } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface ReferralsSectionProps {
  user: UserProfile | null;
}

interface ReferralSetting {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description: string;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  reward_claimed: boolean;
  created_at: string;
  completed_at: string | null;
  status: string;
  referred_name?: string;
  referred_email?: string;
}

const ReferralsSection: React.FC<ReferralsSectionProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralSettings, setReferralSettings] = useState<ReferralSetting | null>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchReferralData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch referral settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('referral_settings')
          .select('*')
          .eq('active', true)
          .single();
        
        if (settingsError) {
          console.error('Error fetching referral settings:', settingsError);
        } else {
          setReferralSettings(settingsData);
        }
        
        // Fetch user referrals
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false });
        
        if (referralsError) {
          console.error('Error fetching referrals:', referralsError);
          return;
        }
        
        // If there are referrals, fetch referred user names
        let referralsWithNames = [...(referralsData || [])];
        
        if (referralsData && referralsData.length > 0) {
          const referredIds = referralsData.map(r => r.referred_id);
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', referredIds);
          
          if (!userError && userData) {
            referralsWithNames = referralsData.map(referral => {
              const referredUser = userData.find(user => user.id === referral.referred_id);
              return {
                ...referral,
                referred_name: referredUser?.name || 'Unknown',
                referred_email: referredUser?.email || 'Unknown'
              };
            });
          }
        }
        
        setReferrals(referralsWithNames);
      } catch (error) {
        console.error('Error fetching referral data:', error);
        toast.error('Failed to load referral information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReferralData();
  }, [user]);

  const copyReferralCode = () => {
    if (!user?.referral_code) return;
    
    navigator.clipboard.writeText(user.referral_code);
    toast.success('Referral code copied to clipboard');
  };

  const copyReferralLink = () => {
    if (!user?.referral_link) return;
    
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/signup?ref=${user.referral_code}`;
    
    navigator.clipboard.writeText(fullLink);
    toast.success('Referral link copied to clipboard');
  };

  const shareReferral = () => {
    if (!user?.referral_code) return;
    
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/signup?ref=${user.referral_code}`;
    const text = `Join me on iFindLife! Use my referral code ${user.referral_code} to sign up and get exclusive benefits.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'iFindLife Referral',
        text,
        url: fullLink,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      copyReferralLink();
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </div>
            <Gift className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Your Referral Code</p>
                <p className="text-2xl font-semibold tracking-wider">{user.referral_code || 'Not available'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyReferralCode} disabled={!user.referral_code}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-muted p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Referral Link</p>
                <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                  {window.location.origin}/signup?ref={user.referral_code}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={copyReferralLink} disabled={!user.referral_code}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={shareReferral} disabled={!user.referral_code}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {referralSettings && (
            <div className="mt-6 border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">How It Works</h3>
              </div>
              <p className="text-muted-foreground mb-4">{referralSettings.description || 'Invite your friends to join iFindLife using your personal referral code and earn rewards!'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-3 bg-muted/50">
                  <p className="text-sm font-medium">You Get</p>
                  <p className="text-xl font-semibold text-green-600">
                    {user.currency} {referralSettings.referrer_reward}
                  </p>
                  <p className="text-xs text-muted-foreground">For each successful referral</p>
                </div>
                <div className="border rounded-md p-3 bg-muted/50">
                  <p className="text-sm font-medium">Your Friend Gets</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {user.currency} {referralSettings.referred_reward}
                  </p>
                  <p className="text-xs text-muted-foreground">When they sign up using your code</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Track your referral activity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading referrals...</p>
            </div>
          ) : referrals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.referred_name || 'User'}</TableCell>
                    <TableCell>
                      {new Date(referral.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {referral.reward_claimed ? (
                        <Badge className="bg-green-100 text-green-800">Claimed</Badge>
                      ) : referral.status === 'completed' ? (
                        <Badge className="bg-blue-100 text-blue-800">Ready to claim</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-4">You haven't referred anyone yet</p>
              <Button onClick={shareReferral} disabled={!user.referral_code}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Your Referral Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsSection;
