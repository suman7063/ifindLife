import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserReferrals } from '@/utils/referralUtils';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ReferralUI } from '@/types/supabase/referrals';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { supabase, toast } from '@/utils/supabase';

const UserReferrals: React.FC = () => {
  const { currentUser } = useUserAuth();
  const [referrals, setReferrals] = useState<ReferralUI[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select(`
            *,
            users:referred_id(*)
          `)
          .eq('referrer_id', currentUser?.id);

        if (error) throw error;

        const referralsUI = data.map(referral => ({
          id: referral.id,
          referrerId: referral.referrer_id,
          referredId: referral.referred_id,
          referralCode: referral.referral_code || '',
          status: referral.status,
          createdAt: referral.created_at,
          completedAt: referral.completed_at,
          rewardClaimed: referral.reward_claimed,
          referredUserName: 'Anonymous User',
          referredUserEmail: 'Unknown',
          
          referrer_id: referral.referrer_id,
          referred_id: referral.referred_id,
          created_at: referral.created_at,
          completed_at: referral.completed_at,
          reward_claimed: referral.reward_claimed
        }));

        setReferrals(referralsUI);
      } catch (error) {
        toast.error('Failed to fetch referrals');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PP');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't referred anyone yet.</p>
              <p>Share your referral code to earn rewards!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reward Claimed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      {referral.referredUserName || 'Anonymous'}
                      <div className="text-gray-500 text-xs">{referral.referredUserEmail}</div>
                    </TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      {referral.rewardClaimed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReferrals;
