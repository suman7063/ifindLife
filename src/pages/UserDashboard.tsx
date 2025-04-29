
import React, { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import useTransactions from '@/hooks/dashboard/useTransactions';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';

const UserDashboard: React.FC = () => {
  const { user, userProfile, isAuthenticated, isLoading, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    refreshTransactions 
  } = useTransactions(userProfile?.id);
  
  const {
    isRechargeDialogOpen,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  } = useRechargeDialog(refreshTransactions);

  const handleLogout = async (): Promise<boolean> => {
    try {
      console.log("UserDashboard - Logging out");
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

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <DashboardLoader />;
  }

  // Don't render dashboard content if not authenticated or not a user
  if (!isAuthenticated || role !== 'user') {
    // Redirect to login page
    navigate('/user-login');
    return null;
  }

  return (
    <Container className="py-8">
      <DashboardHeader 
        user={userProfile} 
        onLogout={handleLogout}
      />
      
      <DashboardContent
        user={userProfile}
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
