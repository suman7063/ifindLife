
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
    
    // Set a more reasonable maximum loading time (5 seconds instead of 3)
    const maxLoadingTimer = setTimeout(() => {
      if (dashboardLoading) {
        console.log("Dashboard max loading time reached, forcing display");
        setDashboardLoading(false);
        setLoadingTimedOut(true);
      }
    }, 5000);

    // If we have user data, stop loading immediately
    if (user || currentUser) {
      console.log("User data available, stopping dashboard loading");
      setDashboardLoading(false);
      
      // If we have a user but no profile, set loading timed out flag after shorter delay
      if (!currentUser && user) {
        const profileTimer = setTimeout(() => {
          console.log("Profile data not found after delay, showing placeholder");
          setLoadingTimedOut(true);
        }, 2000);
        
        return () => clearTimeout(profileTimer);
      }
    }
    
    // Only redirect to login if truly not authenticated and not in loading state
    if (!isAuthenticated && !authLoading && !user) {
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
