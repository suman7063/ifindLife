
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

export const useDashboardState = () => {
  const { currentUser, isAuthenticated, logout, authLoading, user } = useUserAuth();
  const navigate = useNavigate();
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    console.log("Dashboard loading status:", {
      authLoading,
      isAuthenticated,
      hasCurrentUser: !!currentUser,
      hasUser: !!user,
      dashboardLoading
    });
    
    const maxLoadingTimer = setTimeout(() => {
      if (dashboardLoading) {
        console.log("Dashboard max loading time reached, forcing display");
        setDashboardLoading(false);
        setLoadingTimedOut(true);
      }
    }, 3000);

    if (user && !authLoading) {
      console.log("User data available, stopping dashboard loading");
      setDashboardLoading(false);
      
      if (!currentUser) {
        const profileTimer = setTimeout(() => {
          setLoadingTimedOut(true);
        }, 2000);
        
        return () => clearTimeout(profileTimer);
      }
    }
    
    if (!isAuthenticated && !authLoading) {
      console.log("Not authenticated, redirecting to login");
      navigate('/user-login');
    }

    return () => clearTimeout(maxLoadingTimer);
  }, [isAuthenticated, navigate, currentUser, authLoading, user, dashboardLoading]);

  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };

  const handleCloseRechargeDialog = () => {
    setIsRechargeDialogOpen(false);
  };

  const handlePaymentSuccess = () => {
    setIsRechargeDialogOpen(false);
    setIsProcessingPayment(false);
  };

  const handlePaymentCancel = () => {
    setIsProcessingPayment(false);
  };

  return {
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
  };
};

export default useDashboardState;
