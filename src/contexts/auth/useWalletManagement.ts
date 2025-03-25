
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useWalletManagement = (
  currentUser: UserProfile | null
) => {
  const rechargeWallet = (amount: number) => {
    if (!currentUser) return;
    toast.info('This feature will be implemented with Supabase soon');
  };

  const getReferralLink = (): string => {
    if (!currentUser?.referralCode) return '';
    return `${window.location.origin}/signup?ref=${currentUser.referralCode}`;
  };

  return {
    rechargeWallet,
    getReferralLink
  };
};
