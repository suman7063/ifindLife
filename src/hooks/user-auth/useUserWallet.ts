
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useUserWallet = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const rechargeWallet = async (amount: number) => {
    if (!currentUser) {
      toast.error('Please log in to recharge your wallet');
      return;
    }

    try {
      // Simulate a successful transaction
      const newBalance = currentUser.walletBalance + amount;

      // Create a new transaction record
      const { data, error } = await supabase
        .from('user_transactions')
        .insert([{
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'recharge',
          amount: amount,
          currency: currentUser.currency || 'USD',
          description: 'Wallet recharge',
        }]);

      if (error) throw error;

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        walletBalance: newBalance,
        transactions: [...currentUser.transactions, {
          id: data ? data[0].id : 'temp_id', // Use a temporary ID
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'recharge',
          amount: amount,
          currency: currentUser.currency || 'USD',
          description: 'Wallet recharge',
        }],
      };
      setCurrentUser(updatedUser);

      toast.success('Wallet recharged successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to recharge wallet');
    }
  };

  return {
    rechargeWallet
  };
};
