import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferralUI } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ReferralsListProps {
  referrals: ReferralUI[];
  isLoading?: boolean;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">Loading referrals...</div>
        </CardContent>
      </Card>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            You haven't referred anyone yet. Share your referral code to start earning rewards!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Your Referrals ({referrals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium py-2 px-2">User</th>
                <th className="text-center font-medium py-2 px-2">Date</th>
                <th className="text-center font-medium py-2 px-2">Status</th>
                <th className="text-center font-medium py-2 px-2">Reward</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    {referral.referredName || 'Anonymous User'}
                  </td>
                  <td className="py-3 px-2 text-center text-gray-500">
                    {new Date(referral.createdAt || '').toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="py-3 px-2 text-center">
                    {referral.status === 'completed' && referral.rewardClaimed ? (
                      <span className="inline-flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Claimed
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default ReferralsList;
