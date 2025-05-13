import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, UserPlus } from 'lucide-react';
import { Referral } from '@/types/supabase';

// Mock data for testing
const getMockReferrals = (): Referral[] => {
  return [
    {
      id: '1',
      referrer_id: 'user123',
      referred_id: 'user456',
      referral_code: 'REF123',
      reward_claimed: false,
      created_at: '2023-06-15T10:30:00Z',
      status: 'pending',
      referred_name: 'John Doe'
    },
    {
      id: '2',
      referrer_id: 'user123',
      referred_id: 'user789',
      referral_code: 'REF456',
      reward_claimed: true,
      created_at: '2023-05-20T14:45:00Z',
      completed_at: '2023-05-25T09:15:00Z',
      status: 'completed',
      referred_name: 'Jane Smith'
    },
    {
      id: '3',
      referrer_id: 'user123',
      referred_id: 'user101',
      referral_code: 'REF789',
      reward_claimed: false,
      created_at: '2023-04-10T08:20:00Z',
      status: 'cancelled',
      referred_name: 'Mike Johnson'
    }
  ];
};

const ReferralsSection: React.FC = () => {
  const referrals = getMockReferrals();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Referrals</CardTitle>
        <CardDescription>Your referral activity.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Referred User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reward Claimed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{referral.referred_name}</TableCell>
                  <TableCell>
                    {referral.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                    {referral.status === 'completed' && <Badge variant="outline">Completed</Badge>}
                    {referral.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
                  </TableCell>
                  <TableCell className="text-right">{referral.reward_claimed ? <ArrowUp className="inline-block h-4 w-4 mr-2 text-green-500" /> : <ArrowDown className="inline-block h-4 w-4 mr-2 text-red-500" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ReferralsSection;
