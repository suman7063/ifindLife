import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/auth/UserAuthContext';
import { Expert, UserTransaction, UserProfile } from '@/types/supabase';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';

interface UseUserDataFetcherResult {
  favoriteExperts: Expert[];
  transactions: UserTransaction[];
  loading: boolean;
  error: Error | null;
}

export const useUserDataFetcher = (): UseUserDataFetcherResult => {
  const [favoriteExperts, setFavoriteExperts] = useState<Expert[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUserAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [favoritesData, transactionsData] = await Promise.all([
          from('user_favorites')
            .select('expert (*)')
            .eq('user_id', currentUser.id)
            .returns<{ expert: Expert }[]>(),
          from('user_transactions')
            .select('*')
            .eq('user_id', currentUser.id)
            .returns<UserTransaction[]>()
        ]);

        if (favoritesData.error) {
          throw new Error(favoritesData.error.message);
        }

        if (transactionsData.error) {
          throw new Error(transactionsData.error.message);
        }

        setFavoriteExperts(favoritesData.data.map(item => item.expert));
        setTransactions(transactionsData.data);
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
