
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';

interface ReferralsSectionProps {
  user: UserProfile;
}

const ReferralsSection: React.FC<ReferralsSectionProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Generate referral link if not already present
  const referralLink = user?.referral_link || `${window.location.origin}/signup?ref=${user?.referral_code || ''}`;
  
  // Fetch referrals data
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) return;
        
        // Fetch referrals from the database
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id);
          
        if (error) throw error;
        
        setReferrals(data || []);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        toast.error('Failed to load referral data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferrals();
  }, [user?.id]);

  // Handle copy referral link
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success('Referral link copied to clipboard');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        toast.error('Failed to copy referral link');
      });
  };

  // Handle share referral link
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on iFindLife',
        text: 'Check out this amazing wellness platform!',
        url: referralLink,
      })
        .then(() => toast.success('Shared successfully'))
        .catch((error) => {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Referral Program</CardTitle>
          </div>
          <CardDescription>
            Invite friends and earn rewards when they sign up and make their first consultation!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Your Referral Code</div>
            <div className="font-mono bg-background p-2 rounded border text-center text-lg">
              {user?.referral_code || 'No referral code available'}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Share your referral link</div>
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                className="shrink-0"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleShare}
            className="w-full md:w-auto"
            variant="default"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Referral Link
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-6 bg-muted/50 border-t">
          <h4 className="text-base font-medium">Your Referrals</h4>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading referrals...</p>
          ) : referrals.length > 0 ? (
            <div className="w-full mt-2">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
                <div>Name</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              {referrals.map((referral) => (
                <div key={referral.id} className="grid grid-cols-3 gap-2 py-2 border-b text-sm">
                  <div>{referral.referred_name || 'User'}</div>
                  <div>{new Date(referral.created_at).toLocaleDateString()}</div>
                  <div>
                    {referral.status === 'completed' ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">You haven't referred anyone yet.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReferralsSection;
