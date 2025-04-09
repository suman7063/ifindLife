import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAuth } from '@/hooks/useUserAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import WalletSection from '@/components/user/dashboard/WalletSection';
import UserPurchasesSection from '@/components/user/dashboard/UserPurchasesSection';
import UserStatsSummary from '@/components/user/dashboard/UserStatsSummary';
import useDashboardState from '@/hooks/user-dashboard/useDashboardState';
import { UserTransaction } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';

const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    authLoading, 
    user,
    dashboardLoading,
    loadingTimedOut,
    isRechargeDialogOpen,
    isProcessingPayment,
    logout,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handlePaymentSuccess,
    handlePaymentCancel,
    setIsProcessingPayment
  } = useDashboardState();

  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (currentUser?.id) {
        try {
          const { data, error } = await supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('date', { ascending: false });
          
          if (error) {
            console.error('Error fetching transactions:', error);
            return;
          }
          
          const formattedTransactions = (data || []).map(item => ({
            id: item.id,
            user_id: item.user_id,
            amount: item.amount,
            currency: item.currency || 'USD',
            type: item.type,
            transaction_type: item.transaction_type || item.type,
            description: item.description || '',
            date: item.date,
            status: item.status || 'completed',
            created_at: item.created_at || item.date,
            payment_id: item.payment_id || `pay_${Date.now()}`,
            payment_method: item.payment_method || 'wallet'
          })) as UserTransaction[];
          
          setTransactions(formattedTransactions);
        } catch (error) {
          console.error('Error in fetchTransactions:', error);
        }
      }
    };

    if (isAuthenticated && currentUser) {
      fetchTransactions();
    }
  }, [isAuthenticated, currentUser]);

  const handleLogout = async (): Promise<boolean> => {
    try {
      const success = await logout();
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
        return true;
      } else {
        toast.error('Error logging out');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthInitialized && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [isAuthenticated, isAuthLoading, isAuthInitialized, navigate]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-8">
      <DashboardHeader 
        user={currentUser} 
        onLogout={handleLogout}
      />
      
      <DashboardContent
        user={currentUser}
        transactions={transactions}
        isLoading={transactionsLoading}
        onRecharge={handleOpenRechargeDialog}
      />
      
      <RechargeDialog 
        open={isRechargeDialogOpen}
        onOpenChange={handleCloseRechargeDialog}
        onSuccess={handleRechargeSuccess}
      />
    </Container>
  );
};

export default UserDashboard;
