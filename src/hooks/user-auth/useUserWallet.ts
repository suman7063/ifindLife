
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useUserWallet = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to recharge your wallet');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          wallet_balance: (currentUser.walletBalance || 0) + amount
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Add transaction record
      const transactionData = {
        user_id: currentUser.id,
        date: new Date().toISOString(),
        type: 'deposit',
        amount: amount,
        currency: currentUser.currency || 'USD',
        description: 'Wallet recharge'
      };

      const { data: transactionResult, error: transactionError } = await supabase
        .from('user_transactions')
        .insert(transactionData);

      if (transactionError) throw transactionError;

      // Create a new transaction object to add to the user's transactions
      const newTransaction = {
        id: transactionResult && transactionResult[0] ? transactionResult[0].id : `temp_${Date.now()}`,
        ...transactionData
      };

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        walletBalance: (currentUser.walletBalance || 0) + amount,
        transactions: [...(currentUser.transactions || []), newTransaction]
      };
      
      setCurrentUser(updatedUser);

      toast.success(`Successfully added ${amount} ${currentUser.currency || 'USD'} to your wallet`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to recharge wallet');
      return false;
    }
  };

  return {
    rechargeWallet
  };
};
