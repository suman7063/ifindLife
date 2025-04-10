
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/features/auth-sync';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import useTransactions from '@/hooks/dashboard/useTransactions';
import { useRechargeDialog } from '@/features/wallet';
import { Transaction } from '@/types/supabase/transactions';

// Helper function to convert Transaction to UserTransaction
const convertToUserTransaction = (transactions: Transaction[]) => {
  return transactions.map(tx => ({
    ...tx,
    date: tx.created_at, // Set date from created_at
    type: tx.transaction_type, // Set type from transaction_type
    payment_id: tx.payment_id || '',
    payment_method: tx.payment_method || 'wallet',
  }));
};

const UserDashboard: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useUserAuth();
  const { isAuthInitialized, isAuthLoading } = useAuthSynchronization();
  const navigate = useNavigate();
  
  const { 
    transactions, 
    loading: transactionsLoading, 
    refreshTransactions 
  } = useTransactions(currentUser?.id);
  
  const {
    isRechargeDialogOpen,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  } = useRechargeDialog(refreshTransactions);

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
    return <DashboardLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Convert transactions to the expected format
  const userTransactions = convertToUserTransaction(transactions);

  return (
    <Container className="py-8">
      <DashboardHeader 
        user={currentUser} 
        onLogout={handleLogout}
      />
      
      <DashboardContent
        user={currentUser}
        transactions={userTransactions}
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
