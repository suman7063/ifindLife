import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatDistance } from 'date-fns';
import { Users, Gift, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { syncReferralStatusesWithCompletedCalls, processPendingReferralRewards } from '@/utils/referralCompletion';

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalRewardsGiven: number;
  activeUsers: number;
}

interface RecentReferral {
  id: string;
  referrerName: string;
  referredName: string;
  status: string;
  createdAt: string;
  rewardClaimed: boolean;
}

const ReferralAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalRewardsGiven: 0,
    activeUsers: 0
  });
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProcessingRewards, setIsProcessingRewards] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch referral statistics
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*');

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
        return;
      }

      // Calculate stats
      const totalReferrals = referrals?.length || 0;
      const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0;
      const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;

      // Fetch referral settings to calculate total rewards
      // Use select('*') to avoid errors if columns don't exist, then handle in code
      const { data: settings, error: settingsError } = await supabase
        .from('referral_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let rewardsPerCompletion = 0;
      if (!settingsError && settings) {
        // Handle different column structures
        const settingsAny = settings as any;
        
        // Try new structure with currency-specific rewards
        if (settingsAny.referrer_reward_inr !== undefined && settingsAny.referred_reward_inr !== undefined) {
          rewardsPerCompletion = (settingsAny.referrer_reward_inr || 0) + (settingsAny.referred_reward_inr || 0);
        }
        // Try new structure with generic rewards
        else if (settingsAny.referrer_reward !== undefined && settingsAny.referred_reward !== undefined) {
          rewardsPerCompletion = (settingsAny.referrer_reward || 0) + (settingsAny.referred_reward || 0);
        }
        // Try old structure
        else if (settingsAny.reward_amount !== undefined) {
          // Old structure - assume reward_amount is split between referrer and referred
          rewardsPerCompletion = (settingsAny.reward_amount || 0) * 1.5; // Approximate: referrer gets full, referred gets half
        }
      }
      const totalRewardsGiven = completedReferrals * rewardsPerCompletion;

      // Count active users with referral codes
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .not('referral_code', 'is', null);

      setStats({
        totalReferrals,
        pendingReferrals,
        completedReferrals,
        totalRewardsGiven,
        activeUsers: activeUsers || 0
      });

      // Fetch recent referrals with user names
      // First get referrals
      const { data: recentData, error: recentError } = await supabase
        .from('referrals')
        .select('id, referrer_id, referred_id, status, reward_claimed, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('🔍 Recent referrals raw data:', { recentData, recentError });

      if (!recentError && recentData && recentData.length > 0) {
        // Get unique user IDs
        const userIds = new Set<string>();
        recentData.forEach(ref => {
          if (ref.referrer_id) userIds.add(ref.referrer_id);
          if (ref.referred_id) userIds.add(ref.referred_id);
        });

        // Fetch user names
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, name')
          .in('id', Array.from(userIds));

        console.log('🔍 Users data for referrals:', { usersData, usersError });

        // Create a map of user IDs to names
        const userMap = new Map<string, string>();
        if (usersData) {
          usersData.forEach(user => {
            userMap.set(user.id, user.name || 'Unknown');
          });
        }

        // Format referrals with user names
        const formattedReferrals: RecentReferral[] = recentData.map(ref => ({
          id: ref.id,
          referrerName: userMap.get(ref.referrer_id) || 'Unknown',
          referredName: userMap.get(ref.referred_id) || 'Unknown',
          status: ref.status,
          createdAt: ref.created_at,
          rewardClaimed: ref.reward_claimed
        }));

        console.log('🔍 Formatted recent referrals:', formattedReferrals);
        setRecentReferrals(formattedReferrals);
      } else {
        console.log('⚠️ No recent referrals found or error:', { recentError, recentData });
        setRecentReferrals([]);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchAnalytics();
    }, 30000);

    // Set up real-time subscription for referrals table
    const referralsSubscription = supabase
      .channel('referrals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referrals'
        },
        () => {
          // Refresh data when referrals table changes
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      clearInterval(refreshInterval);
      referralsSubscription.unsubscribe();
    };
  }, [fetchAnalytics]);

  const handleSyncReferrals = async () => {
    setIsSyncing(true);
    try {
      const result = await syncReferralStatusesWithCompletedCalls();
      console.log('✅ Sync complete:', result);
      // Refresh data after sync
      await fetchAnalytics();
      
      let message = `Sync complete: ${result.updated} referrals updated`;
      if (result.errors > 0) {
        message += `, ${result.errors} errors. Check browser console for details.`;
      }
      alert(message);
    } catch (error) {
      console.error('Error syncing referrals:', error);
      alert(`Error syncing referrals: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcessRewards = async () => {
    setIsProcessingRewards(true);
    try {
      const result = await processPendingReferralRewards();
      console.log('✅ Process rewards complete:', result);
      // Refresh data after processing
      await fetchAnalytics();
      
      let message = `Rewards processed: ${result.processed} credits awarded`;
      if (result.failed > 0) {
        message += `, ${result.failed} failed. Check browser console for details.`;
      }
      if (result.processed === 0) {
        message = 'No pending rewards to process. Rewards are awarded 48 hours after call completion.';
      }
      alert(message);
    } catch (error) {
      console.error('Error processing rewards:', error);
      alert(`Error processing rewards: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
    } finally {
      setIsProcessingRewards(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReferrals} pending, {stats.completedReferrals} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Users with referral codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRewardsGiven}</div>
            <p className="text-xs text-muted-foreground">
              Rewards distributed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalReferrals > 0 ? Math.round((stats.completedReferrals / stats.totalReferrals) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>
                Latest referral activities in your system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncReferrals}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Status'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProcessRewards}
                disabled={isProcessingRewards}
              >
                <Gift className={`h-4 w-4 mr-2 ${isProcessingRewards ? 'animate-spin' : ''}`} />
                {isProcessingRewards ? 'Processing...' : 'Process Rewards'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReferrals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No referrals found</p>
            ) : (
              recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span className="text-primary">{referral.referrerName}</span> referred{' '}
                      <span className="text-primary">{referral.referredName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistance(new Date(referral.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      referral.status === 'completed' ? 'default' : 
                      referral.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {referral.status}
                    </Badge>
                    {referral.rewardClaimed && (
                      <Badge variant="outline" className="text-green-600">
                        Rewarded
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralAnalytics;