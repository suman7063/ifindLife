
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/auth-sync';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import { useTransactions } from '@/hooks/useTransactions';
import { useRechargeDialog } from '@/hooks/useRechargeDialog';

const UserDashboard: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useUserAuth();
  const { isAuthInitialized, isAuthLoading } = useAuthSynchronization();
  const navigate = useNavigate();
  
  const { 
    transactions, 
    isLoading: transactionsLoading, 
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

  // Add default values for missing properties to prevent errors
  const enhancedUser = currentUser ? {
    ...currentUser,
    consultation_count: currentUser.consultation_count ?? 0,
    referral_count: currentUser.referral_code ? 1 : 0,
  } : null;

  return (
    <Container className="py-8">
      <DashboardHeader 
        user={enhancedUser} 
        onLogout={handleLogout}
      />
      
      <DashboardContent
        user={enhancedUser}
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
