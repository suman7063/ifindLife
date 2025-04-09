
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { UserTransaction } from '@/types/supabase/tables';

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
          wallet_balance: (currentUser.wallet_balance || 0) + amount
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Add transaction record
      const transactionData = {
        user_id: currentUser.id,
        date: new Date().toISOString(),
        type: 'credit' as const, // Enforce type to be "credit"
        amount: amount,
        currency: currentUser.currency || 'USD',
        description: 'Wallet recharge',
        status: 'completed',
        payment_method: 'online',
        payment_id: `recharge_${Date.now()}`
      };

      const { data: transactionResult, error: transactionError } = await supabase
        .from('user_transactions')
        .insert(transactionData);

      if (transactionError) throw transactionError;

      // Create a safer way to get the transaction ID
      let newTransactionId = `temp_${Date.now()}`;
      
      if (transactionResult) {
        // Ensure transactionResult is an array
        const resultArray = Array.isArray(transactionResult) ? transactionResult : [];
        // Check if array has items and first item has an id
        if (resultArray.length > 0 && typeof resultArray[0] === 'object') {
          const firstItem = resultArray[0] as Record<string, any>;
          if ('id' in firstItem) {
            newTransactionId = firstItem.id;
          }
        }
      }

      // Create a new transaction object that conforms to UserTransaction type
      const newTransaction: UserTransaction = {
        id: newTransactionId,
        user_id: transactionData.user_id,
        amount: transactionData.amount,
        type: transactionData.type,
        status: transactionData.status,
        date: transactionData.date,
        currency: transactionData.currency,
        description: transactionData.description,
        created_at: new Date().toISOString(),
        payment_id: transactionData.payment_id,
        payment_method: transactionData.payment_method,
        transaction_type: transactionData.type // Set the transaction_type field
      };

      // Optimistically update the local state
      const updatedUser = {
        ...currentUser,
        wallet_balance: (currentUser.wallet_balance || 0) + amount,
        walletBalance: (currentUser.wallet_balance || 0) + amount,
        transactions: [...(currentUser.transactions || []), newTransaction]
      } as UserProfile;
      
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
