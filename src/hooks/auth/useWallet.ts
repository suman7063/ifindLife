
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile, UserTransaction } from '@/types/supabase';

export const useWallet = () => {
  const rechargeWallet = async (currentUser: UserProfile | null, amount: number) => {
    if (!currentUser) {
      toast.error('Please log in to recharge your wallet');
      return null;
    }

    try {
      // Simulate a successful transaction
      const newBalance = (currentUser.walletBalance || 0) + amount;

      // Create a new transaction record
      const { data, error } = await supabase
        .from('user_transactions')
        .insert({
          user_id: currentUser.id,
          date: new Date().toISOString(),
          type: 'recharge',
          amount: amount,
          currency: currentUser.currency || 'USD',
          description: 'Wallet recharge',
        })
        .select();

      if (error) throw error;

      // Return updated user data to update the local state
      const newTransactionId = data && data.length > 0 ? data[0].id : 'temp_id';
      
      const newTransaction: UserTransaction = {
        id: newTransactionId,
        user_id: currentUser.id,
        date: new Date().toISOString(),
        type: 'recharge',
        amount: amount,
        currency: currentUser.currency || 'USD',
        description: 'Wallet recharge',
      };

      const updatedUser = {
        ...currentUser,
        walletBalance: newBalance,
        transactions: [...(currentUser.transactions || []), newTransaction],
      };

      toast.success('Wallet recharged successfully!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to recharge wallet');
      return null;
    }
  };

  return {
    rechargeWallet
  };
};
