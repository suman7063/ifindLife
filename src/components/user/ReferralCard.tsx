
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { ReferralSettings, UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

interface ReferralCardProps {
  settings?: ReferralSettings | null;
  userProfile: UserProfile;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ settings, userProfile }) => {
  const { getReferralLink } = useUserAuth();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get the referral link using the hook from UserAuthContext
  const referralLink = userProfile?.referral_code ? getReferralLink() : null;

  // Format the reward amount with currency symbol
  const formattedAmount = settings?.referrer_reward
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR', // Using INR as default since settings doesn't have currency
        minimumFractionDigits: 0,
      }).format(settings.referrer_reward)
    : '₹500';

  const copyToClipboard = () => {
    if (!referralLink) return;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy. Please try again.");
      });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center">Your Referral Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Share this link with friends and both of you will receive <span className="font-semibold text-ifind-aqua">{formattedAmount}</span> when they sign up!
          </p>
          
          <div className="relative mt-2">
            <div className="flex items-center">
              <input
                type="text"
                value={referralLink || "Generating link..."}
                readOnly
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm overflow-hidden text-ellipsis pr-10"
              />
              <Button
                size="sm" 
                variant="ghost" 
                className="absolute right-0 h-full px-3 py-2"
                onClick={copyToClipboard}
                disabled={!referralLink || copied || isGenerating}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {!referralLink && userProfile?.referral_code && (
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => {
                  setIsGenerating(true);
                  // Force a refresh after a short delay
                  setTimeout(() => {
                    setIsGenerating(false);
                  }, 1000);
                }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate Link
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-xs text-center text-muted-foreground px-4">
          <p>Terms apply. Rewards are credited after your friend's first session.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReferralCard;
