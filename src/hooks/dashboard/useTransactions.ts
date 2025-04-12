
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

      const formattedTransactions = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        currency: item.currency || 'USD',
        type: item.type,
        description: item.description || '',
        date: item.date,
        // Ensure all required fields from UserTransaction interface are present
        status: item.status || 'completed',
        created_at: item.created_at || item.date,
        payment_id: item.payment_id || `pay_${Date.now()}`,
        payment_method: item.payment_method || 'wallet',
        transaction_type: item.transaction_type || item.type
      })) as UserTransaction[];
      
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
