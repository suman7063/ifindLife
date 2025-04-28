
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import DashboardContent from '@/components/user/dashboard/DashboardContent';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import useTransactions from '@/hooks/dashboard/useTransactions';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';

const UserDashboard: React.FC = () => {
  const { currentUser, isAuthenticated, logout, loading } = useUserAuth();
  const { isAuthInitialized, isAuthLoading, isUserAuthenticated } = useAuthSynchronization();
  const [checkingAuth, setCheckingAuth] = useState(true);
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

  // Add a logged in status check with short timeout to ensure data is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    console.log("UserDashboard - Auth state:", {
      isAuthenticated,
      isAuthLoading,
      isUserAuthenticated,
      loading,
      isAuthInitialized,
      checkingAuth,
      hasCurrentUser: !!currentUser
    });
    
    if (!checkingAuth && !isAuthLoading && !loading && !isAuthenticated) {
      console.log("UserDashboard - Not authenticated, redirecting to login");
      navigate('/user-login');
    }
  }, [isAuthenticated, isAuthLoading, loading, navigate, checkingAuth, isAuthInitialized, currentUser, isUserAuthenticated]);

  // Show loading state while authentication is being checked
  if (isAuthLoading || loading || checkingAuth) {
    return <DashboardLoader />;
  }

  // Don't render dashboard content if not authenticated
  if (!isAuthenticated && !isUserAuthenticated) {
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
