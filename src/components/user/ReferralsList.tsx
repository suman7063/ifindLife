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

interface ReferralsListProps {
  referrals: ReferralUI[];
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals }) => {
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
