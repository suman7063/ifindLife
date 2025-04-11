
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReferralUI } from '@/types/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferralsListProps {
  referrals: ReferralUI[];
  isLoading?: boolean; // Added the isLoading prop
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referred User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reward Claimed</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={referral.id}>
            <TableCell>{referral.referredName || 'N/A'}</TableCell>
            <TableCell>{referral.status}</TableCell>
            <TableCell>{referral.rewardClaimed ? 'Yes' : 'No'}</TableCell>
            <TableCell>{
              referral.created_at ? 
                new Date(referral.created_at).toLocaleDateString() : 
                'N/A'
            }</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReferralsList;
