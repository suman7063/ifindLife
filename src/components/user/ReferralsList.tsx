
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReferralUI } from '@/types/supabase/referrals';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferralsListProps {
  referrals: ReferralUI[];
  isLoading?: boolean;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground">You haven't invited anyone yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-mono">{referral.referralCode}</TableCell>
              <TableCell>
                {referral.referredUserName || 
                  referral.referredUserEmail || 
                  'Pending'}
              </TableCell>
              <TableCell>
                {format(new Date(referral.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <StatusBadge status={referral.status} />
              </TableCell>
              <TableCell>
                {referral.rewardClaimed ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Claimed
                  </Badge>
                ) : referral.status === 'completed' ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Pending
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Completed
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {status}
        </Badge>
      );
  }
};

export default ReferralsList;
