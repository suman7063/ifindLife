
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/auth/UserAuthContext';
import { ExpertProfile } from '@/types/supabase/expert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserTransaction } from '@/types/supabase/tables';

interface UseUserDataFetcherResult {
  favoriteExperts: ExpertProfile[];
  transactions: UserTransaction[];
  loading: boolean;
  error: Error | null;
}

export const useUserDataFetcher = (): UseUserDataFetcherResult => {
  const [favoriteExperts, setFavoriteExperts] = useState<ExpertProfile[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useContext(UserAuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [favoritesData, transactionsData] = await Promise.all([
          supabase
            .from('user_favorites')
            .select('expert (*)')
            .eq('user_id', currentUser.id),
          supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', currentUser.id)
        ]);

        if (favoritesData.error) {
          throw new Error(favoritesData.error.message);
        }

        if (transactionsData.error) {
          throw new Error(transactionsData.error.message);
        }

        setFavoriteExperts(favoritesData.data?.map(item => item.expert) || []);
        
        // Transform transaction data to match our UserTransaction interface
        const formattedTransactions = (transactionsData.data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          amount: item.amount,
          currency: item.currency || 'USD',
          type: item.type as 'credit' | 'debit',
          transaction_type: item.type,
          description: item.description,
          date: item.date,
        })) as UserTransaction[];
        
        setTransactions(formattedTransactions);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        toast.error('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return {
    favoriteExperts,
    transactions,
    loading,
    error
  };
};
