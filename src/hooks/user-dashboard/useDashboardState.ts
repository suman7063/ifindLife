import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';

interface DashboardData {
  totalAppointments: number;
  upcomingAppointments: number;
  favoriteExperts: number;
  walletBalance: number;
  recentTransactions: any[];
  isLoading: boolean;
}

export const useDashboardState = () => {
  const { currentUser } = useUserAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    favoriteExperts: 0,
    walletBalance: 0,
    recentTransactions: [],
    isLoading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.id) return;

      try {
        setDashboardData(prev => ({ ...prev, isLoading: true }));

        // Fetch appointments count
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id, status')
          .eq('user_id', currentUser.id);

        if (appointmentsError) throw appointmentsError;

        // Fetch favorites count
        const { data: favorites, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', currentUser.id);

        if (favoritesError) throw favoritesError;

        // Fetch recent transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('date', { ascending: false })
          .limit(5);

        if (transactionsError) throw transactionsError;

        // Calculate stats
        const totalAppointments = appointments?.length || 0;
        const upcomingAppointments = appointments?.filter(
          apt => apt.status === 'scheduled' || apt.status === 'confirmed'
        ).length || 0;

        setDashboardData({
          totalAppointments,
          upcomingAppointments,
          favoriteExperts: favorites?.length || 0,
          walletBalance: currentUser.wallet_balance || 0,
          recentTransactions: transactions || [],
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  return dashboardData;
};
