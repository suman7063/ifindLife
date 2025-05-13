
import React, { useState } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Referral } from '@/types/supabase/referral';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Copy, Share2, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ReferralsSectionProps {
  user: UserProfile | null;
}

// Mock referrals data
const mockReferrals: Referral[] = [
  {
    id: '1',
    referrer_id: 'current-user',
    referred_id: 'user-1',
    status: 'completed',
    reward_claimed: true,
    referral_code: 'ABC123',
    created_at: '2025-03-15T10:00:00Z',
    completed_at: '2025-03-16T14:30:00Z'
  },
  {
    id: '2',
    referrer_id: 'current-user',
    referred_id: 'user-2',
    status: 'pending',
    reward_claimed: false,
    referral_code: 'ABC123',
    created_at: '2025-04-20T08:45:00Z',
    completed_at: null
  },
  {
    id: '3',
    referrer_id: 'current-user',
    referred_id: 'user-3',
    status: 'completed',
    reward_claimed: true,
    referral_code: 'ABC123',
    created_at: '2025-02-25T11:20:00Z',
    completed_at: '2025-02-28T16:15:00Z'
  },
];

// Mock referral rewards data
const referralRewards = {
  referrerReward: 10,
  referredReward: 5,
  totalEarned: 20,
  pendingRewards: 10,
};

const ReferralsSection: React.FC<ReferralsSectionProps> = ({ user }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const referralCode = user?.referral_code || 'ABC123';
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard');
  };
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard');
  };
  
  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join iFindLife',
        text: `Use my referral code ${referralCode} to join iFindLife and get $5 credit!`,
        url: referralLink,
      }).then(() => {
        setIsShareDialogOpen(false);
      }).catch(console.error);
    } else {
      copyReferralLink();
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Referral Program</h2>
        <p className="text-muted-foreground">
          Invite friends and earn rewards
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Referral Link Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
            <CardDescription>Share this code with friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
              
              <div className="flex items-center w-full">
                <Input
                  value={referralCode}
                  readOnly
                  className="text-center font-mono text-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={copyReferralCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Your Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Referral Link</DialogTitle>
                    <DialogDescription>
                      Share this link with friends to earn rewards when they sign up
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2 mt-4">
                    <Input value={referralLink} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={copyReferralLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button onClick={shareReferral}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        {/* Referral Stats Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Referral Stats</CardTitle>
            <CardDescription>Track your referral rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <h3 className="text-2xl font-bold">${referralRewards.totalEarned}</h3>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
                <h3 className="text-2xl font-bold">${referralRewards.pendingRewards}</h3>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">How It Works</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>Share your unique referral code with friends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>When they sign up and complete a consultation, you'll both earn rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                    <span>You get ${referralRewards.referrerReward} and they get ${referralRewards.referredReward} credit</span>
                  </li>
                </ul>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="/referral-terms">
                  Program Terms & Conditions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          {mockReferrals.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(referral.status)}
                          {getStatusBadge(referral.status)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(referral.created_at)}</TableCell>
                      <TableCell>{formatDate(referral.completed_at)}</TableCell>
                      <TableCell>
                        {referral.reward_claimed ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" /> Claimed
                          </span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No referrals yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your referral code to start earning rewards
              </p>
              <Button onClick={() => setIsShareDialogOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsSection;
