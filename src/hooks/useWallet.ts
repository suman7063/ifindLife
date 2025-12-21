import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
  expires_at: string | null;
}

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: { action: 'get_balance' }
      });

      if (error) {
        console.error('Wallet operations error:', error);
        
        // Handle different error types
        if (error.message?.includes('Failed to send a request to the Edge Function')) {
          console.warn('⚠️ Wallet operations edge function may not be deployed. Please deploy the function or check your Supabase configuration.');
          // Don't show toast for deployment issues - it's a dev/deployment problem
          setBalance(0);
          return 0;
        }
        
        // Don't show toast for auth errors - user might not be logged in
        if (error.message && !error.message.includes('Unauthorized') && !error.message.includes('401')) {
          // Only show toast for unexpected errors
          console.error('Wallet balance fetch error:', error.message);
        }
        setBalance(0);
        return 0;
      }

      const balance = typeof data?.balance === 'number' ? data.balance : 0;
      setBalance(balance);
      return balance;
    } catch (error: any) {
      console.error('Error fetching wallet balance:', error);
      
      // Handle edge function deployment issues gracefully
      if (error.message?.includes('Failed to send a request to the Edge Function') || 
          error.name === 'FunctionsFetchError') {
        console.warn('⚠️ Wallet operations edge function may not be deployed. Please deploy the function or check your Supabase configuration.');
        setBalance(0);
        return 0;
      }
      
      // Only show toast for non-auth errors
      if (error.message && !error.message.includes('Unauthorized') && !error.message.includes('401')) {
        console.error('Unexpected wallet error:', error.message);
      }
      setBalance(0);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (limit = 50) => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: { 
          action: 'get_transactions',
          limit 
        }
      });

      if (error) throw error;

      setTransactions(data?.transactions || []);
      return data?.transactions || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  const deductCredits = async (
    amount: number,
    reason: string,
    referenceId: string | null,
    referenceType: string = 'appointment',
    description?: string,
    currency: 'INR' | 'EUR' = 'INR',
    metadata?: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: {
          action: 'deduct_credits',
          amount,
          reason,
          reference_id: referenceId,
          reference_type: referenceType,
          description,
          currency,
          metadata
        }
      });

      if (error) throw error;

      if (data?.success) {
        setBalance(data.new_balance || 0);
        return { success: true, new_balance: data.new_balance, transaction: data.transaction };
      }

      throw new Error(data?.error || 'Failed to deduct credits');
    } catch (error: any) {
      console.error('Error deducting credits:', error);
      toast.error(error.message || 'Failed to deduct credits');
      return { success: false, error: error.message };
    }
  };

  const addCredits = async (
    amount: number,
    reason: string = 'purchase',
    referenceId: string | null = null,
    referenceType: string = 'razorpay_payment',
    description?: string,
    currency: 'INR' | 'EUR' = 'INR'
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: {
          action: 'add_credits',
          amount,
          reason,
          reference_id: referenceId,
          reference_type: referenceType,
          description,
          currency
        }
      });

      if (error) throw error;

      if (data?.success) {
        setBalance(data.new_balance || 0);
        return { success: true, new_balance: data.new_balance, transaction: data.transaction };
      }

      throw new Error(data?.error || 'Failed to add credits');
    } catch (error: any) {
      console.error('Error adding credits:', error);
      toast.error(error.message || 'Failed to add credits');
      return { success: false, error: error.message };
    }
  };

  const checkBalance = async (requiredAmount: number): Promise<boolean> => {
    const currentBalance = await fetchBalance();
    return currentBalance >= requiredAmount;
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    balance,
    loading,
    transactions,
    fetchBalance,
    fetchTransactions,
    deductCredits,
    addCredits,
    checkBalance,
    refresh: fetchBalance
  };
};

