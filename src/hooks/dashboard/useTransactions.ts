
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserTransaction } from '@/types/supabase/tables';

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch transactions from Supabase
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Map the results to our UserTransaction type
      const formattedTransactions: UserTransaction[] = data.map((transaction: any) => ({
        id: transaction.id,
        user_id: transaction.user_id,
        amount: transaction.amount,
        currency: transaction.currency || 'INR',
        description: transaction.description || '',
        date: transaction.date || transaction.created_at,
        type: transaction.type || 'payment',
        status: transaction.status || 'completed',
        created_at: transaction.created_at || new Date().toISOString(),
        payment_id: transaction.payment_id || '',
        payment_method: transaction.payment_method || 'default',
        transaction_type: transaction.transaction_type || transaction.type || 'payment'
      }));

      setTransactions(formattedTransactions);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // Add the refreshTransactions function that was needed by other components
  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  return { transactions, isLoading, error, refreshTransactions };
};

export default useTransactions;
