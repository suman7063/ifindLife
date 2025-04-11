
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
  currency: string;
}

export const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const fetchTransactions = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, [userId]);
  
  const refreshTransactions = async () => {
    await fetchTransactions();
  };
  
  return { 
    transactions, 
    isLoading,
    refreshTransactions
  };
};

export default useTransactions;
