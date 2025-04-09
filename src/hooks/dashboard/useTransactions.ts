
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserTransaction } from '@/types/supabase/tables';

interface UseTransactionsProps {
  transactions: UserTransaction[];
  isLoading: boolean;
  error: Error | null;
  refreshTransactions: () => Promise<void>;
}

const useTransactions = (userId?: string): UseTransactionsProps => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    if (!userId) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Explicitly cast the data as UserTransaction[]
      const typedData = data as UserTransaction[];
      
      // Transform and standardize the transaction data
      const formattedTransactions = typedData.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        currency: item.currency || 'USD',
        description: item.description || '',
        date: item.date,
        type: item.type,
        status: item.status || 'completed', // Default status if missing
        created_at: item.created_at || item.date, // Use date as fallback
        payment_id: item.payment_id || `pay_${Date.now()}`, // Generate fallback ID
        payment_method: item.payment_method || 'wallet', // Default payment method
        transaction_type: item.transaction_type || item.type // Keep backwards compatibility
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions
  };
};

export default useTransactions;
