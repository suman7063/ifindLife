
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Extended interface to include all required properties
interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  date: string;
  // Added missing properties
  status?: string;
  created_at?: string;
  payment_id?: string;
  payment_method?: string;
  transaction_type?: string;
}

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
        // Add the missing properties with default values if they don't exist
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
