
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useWallet = (user: any) => {
  const [walletBalance, setWalletBalance] = useState(0);

  // Get wallet balance
  const fetchWalletBalance = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error getting wallet balance:', error);
        return 0;
      }
      
      const balance = data?.balance || 0;
      setWalletBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  };
  
  // Refresh wallet balance
  const refreshWalletBalance = async (): Promise<number> => {
    if (!user) return 0;
    return fetchWalletBalance(user.id);
  };
  
  // Add funds to wallet
  const addFunds = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add funds');
      return false;
    }
    
    try {
      // First get current balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (walletError) {
        console.error('Error getting wallet:', walletError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      const currentBalance = walletData?.balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: amount,
          type: 'credit',
          status: 'completed',
          description: 'Wallet recharge',
          created_at: new Date().toISOString()
        }]);
      
      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Non-blocking error, continue
      }
      
      // Update local state
      setWalletBalance(newBalance);
      toast.success(`$${amount} added to your wallet`);
      return true;
    } catch (error) {
      console.error('Error adding funds:', error);
      toast.error('An error occurred while adding funds');
      return false;
    }
  };
  
  // Deduct funds from wallet
  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to use wallet');
      return false;
    }
    
    try {
      // First get current balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (walletError) {
        console.error('Error getting wallet:', walletError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      const currentBalance = walletData?.balance || 0;
      
      // Check if balance is sufficient
      if (currentBalance < amount) {
        toast.error('Insufficient balance. Please recharge your wallet.');
        return false;
      }
      
      const newBalance = currentBalance - amount;
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallet')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast.error('Failed to update wallet');
        return false;
      }
      
      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: amount,
          type: 'debit',
          status: 'completed',
          description: description || 'Service fee',
          created_at: new Date().toISOString()
        }]);
      
      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Non-blocking error, continue
      }
      
      // Update local state
      setWalletBalance(newBalance);
      return true;
    } catch (error) {
      console.error('Error deducting funds:', error);
      toast.error('An error occurred while processing payment');
      return false;
    }
  };

  return {
    walletBalance,
    fetchWalletBalance,
    refreshWalletBalance,
    addFunds,
    deductFunds
  };
};
