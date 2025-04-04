
import { useState } from 'react';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getReferralLink as generateReferralLink } from '@/utils/referralUtils';

export const useWalletManagement = (currentUser: UserProfile | null) => {
  const [walletLoading, setWalletLoading] = useState(false);
  const [referralLinkCache, setReferralLinkCache] = useState<string | null>(null);

  const rechargeWallet = async (amount: number): Promise<boolean> => {
    if (!currentUser) {
      toast.error('You must be logged in to recharge your wallet');
      return false;
    }

    try {
      setWalletLoading(true);
      // Actual recharge would be done through RazorPay integration
      // This is just a placeholder for when the payment is confirmed
      
      // Database update would happen via an edge function after payment verification
      return true;
    } catch (error) {
      console.error('Error recharging wallet:', error);
      toast.error('Failed to recharge wallet');
      return false;
    } finally {
      setWalletLoading(false);
    }
  };

  // Get the referral link for the current user with caching
  const getReferralLink = (): string | null => {
    // Return cached link if available
    if (referralLinkCache) {
      return referralLinkCache;
    }
    
    if (!currentUser?.referral_code) {
      return null;
    }
    
    try {
      // Generate a new referral link using the user's referral code
      const link = generateReferralLink(currentUser.referral_code);
      setReferralLinkCache(link);
      return link;
    } catch (error) {
      console.error('Error generating referral link:', error);
      return null;
    }
  };

  return {
    rechargeWallet,
    walletLoading,
    getReferralLink
  };
};
