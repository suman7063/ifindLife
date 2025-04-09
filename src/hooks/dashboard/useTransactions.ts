
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserTransaction } from '@/types/supabase/transactions';
import { toast } from 'sonner';

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transaction history');
          } else {
            const formattedTransactions = (data || []).map(item => ({
              id: item.id,
              user_id: item.user_id,
              amount: item.amount,
              currency: item.currency || 'USD',
              type: item.type as 'credit' | 'debit',
              transaction_type: item.type,
              description: item.description,
              date: item.date || new Date().toISOString(),
              status: item.status || 'completed',
              created_at: item.created_at || item.date || new Date().toISOString(),
              payment_id: item.payment_id,
              payment_method: item.payment_method
            })) as UserTransaction[];
            
            setTransactions(formattedTransactions);
          }
        } catch (error) {
          console.error('Error in transaction fetch:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const refreshTransactions = async () => {
    if (userId) {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error refreshing transactions:', error);
          return;
        }

        const formattedTransactions = (data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          amount: item.amount,
          currency: item.currency || 'USD',
          type: item.type as 'credit' | 'debit',
          transaction_type: item.type,
          description: item.description,
          date: item.date || new Date().toISOString(),
          status: item.status || 'completed',
          created_at: item.created_at || item.date || new Date().toISOString(),
          payment_id: item.payment_id,
          payment_method: item.payment_method
        })) as UserTransaction[];
        
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error in transaction refresh:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    transactions,
    isLoading,
    refreshTransactions
  };
};

export default useTransactions;
