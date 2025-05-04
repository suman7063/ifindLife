
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import RechargeDialog from '@/components/user/dashboard/wallet/RechargeDialog';
import useTransactions from '@/hooks/dashboard/useTransactions';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';

const UserDashboard: React.FC = () => {
  const { currentUser, isAuthenticated, loading: authLoading, logout } = useUserAuth();
  const { isLoading: authContextLoading } = useAuth();
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
    if (!authLoading && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || authContextLoading) {
    return <DashboardLoader />;
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
