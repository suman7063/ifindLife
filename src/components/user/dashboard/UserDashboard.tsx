
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
import { UserTransaction } from '@/types/supabase/transactions';
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

  // Fetch user transactions when user is authenticated
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
          
          setTransactions(data || []);
        } catch (error) {
          console.error('Error in fetchTransactions:', error);
        }
      }
    };

    if (isAuthenticated && currentUser) {
      fetchTransactions();
    }
  }, [isAuthenticated, currentUser]);

  if (dashboardLoading || authLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && !authLoading) {
    // Redirect handled in the useDashboardState hook
    return <LoadingScreen message="Redirecting to login..." />;
  }

  return (
    <Container className="py-8">
      <DashboardHeader 
        user={currentUser}
        onLogout={logout}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="purchases">Your Purchases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <UserStatsSummary 
            user={currentUser}
            appointmentsCount={0}
            programsCount={0}
          />
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <WalletSection 
            user={currentUser}
            transactions={transactions}
            onRecharge={handleOpenRechargeDialog}
          />
        </TabsContent>
        
        <TabsContent value="purchases" className="mt-6">
          <UserPurchasesSection userId={currentUser?.id} />
        </TabsContent>
      </Tabs>
      
      {isRechargeDialogOpen && (
        <RechargeDialog
          open={isRechargeDialogOpen}
          onOpenChange={handleCloseRechargeDialog}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          isProcessing={isProcessingPayment}
          setIsProcessing={setIsProcessingPayment}
          user={currentUser}
        />
      )}
    </Container>
  );
};

export default UserDashboard;
