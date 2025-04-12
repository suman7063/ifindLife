
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserTransaction } from '@/types/supabase/tables';

const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    if (!userId) {
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
      
      if (error) {
        throw new Error(error.message);
      }

      const formattedTransactions = (data || []).map(item => {
        // Create a base transaction object
        const transaction: UserTransaction = {
          id: item.id,
          user_id: item.user_id,
          amount: item.amount,
          currency: item.currency || 'USD',
          type: item.type,
          description: item.description || '',
          date: item.date,
          status: 'completed', // Default value
          created_at: item.date, // Use date as created_at if not present
          payment_id: `pay_${Date.now()}`, // Generate a default payment_id
          payment_method: 'wallet', // Default payment method
          transaction_type: item.type // Default to use type as transaction_type
        };
        
        return transaction;
      });
      
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      toast.error('Error loading transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions: fetchTransactions
  };
};

export default useTransactions;
