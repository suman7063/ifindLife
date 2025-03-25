
import { UserProfile } from '@/types/supabase';
import { useUserWallet } from '@/hooks/user-auth/useUserWallet';

export const useWalletManagement = (
  currentUser: UserProfile | null,
  setCurrentUser?: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const { rechargeWallet } = useUserWallet(
    currentUser, 
    setCurrentUser || ((() => {}) as React.Dispatch<React.SetStateAction<UserProfile | null>>)
  );

  const getReferralLink = (): string => {
    if (!currentUser || !currentUser.referralLink) return '';
    
    const baseUrl = window.location.origin;
    return `${baseUrl}${currentUser.referralLink}`;
  };

  return {
    rechargeWallet,
    getReferralLink
  };
};
