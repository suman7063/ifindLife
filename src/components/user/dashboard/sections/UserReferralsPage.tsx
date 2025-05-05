
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReferralCard from '@/components/user/ReferralCard';
import { ReferralSettings } from '@/types/supabase/referral';
import { fetchReferralSettings, fetchUserReferrals } from '@/utils/referralUtils';
import { AlertCircle } from 'lucide-react';

interface UserReferralsPageProps {
  user: UserProfile | null;
}

const UserReferralsPage: React.FC<UserReferralsPageProps> = ({ user }) => {
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load referral settings
        const settingsData = await fetchReferralSettings();
        setSettings(settingsData);
        
        // Load user's referrals if user exists
        if (user?.id) {
          const userReferrals = await fetchUserReferrals(user.id);
          setReferrals(userReferrals);
        }
      } catch (err) {
        console.error('Error loading referral data:', err);
        setError('Failed to load referral information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-2">Your Referrals</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">Loading referrals information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-2">Your Referrals</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-2">Referral Program</h2>
      <p className="text-muted-foreground mb-4">
        Invite friends to iFindLife and earn rewards
      </p>
      
      <Tabs defaultValue="info">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="info">Referral Info</TabsTrigger>
            <TabsTrigger value="stats">Your Referrals</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="space-y-6">
          <p className="text-muted-foreground mb-6">
            Share your unique referral code with friends. When they sign up and complete their first session,
            you'll both earn rewards!
          </p>
          
          <ReferralCard userProfile={user} settings={settings} />

          <div className="mt-8 bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">How it Works</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Share your unique referral code with friends</li>
              <li>They sign up using your code</li>
              <li>After they complete their first consultation, you both get rewards</li>
              <li>Rewards are automatically added to your wallet</li>
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {referrals.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Referred Person</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-t">
                      <td className="px-4 py-3">{referral.referredName || 'Anonymous User'}</td>
                      <td className="px-4 py-3">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          referral.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {referral.rewardClaimed ? 
                          `$${settings?.referrer_reward || '10'} Earned` : 
                          'Pending'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">You haven't referred anyone yet.</p>
              <p className="mt-2">Share your referral code to start earning rewards!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserReferralsPage;
