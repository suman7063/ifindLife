
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/lib/supabase';

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
    
    // Set a more reasonable maximum loading time (5 seconds)
    const maxLoadingTimer = setTimeout(() => {
      if (dashboardLoading) {
        console.log("Dashboard max loading time reached, forcing display");
        setDashboardLoading(false);
        setLoadingTimedOut(true);
      }
    }, 5000);

    // If we have user data, stop loading after a short delay to ensure everything is ready
    if (user || currentUser) {
      console.log("User data available, stopping dashboard loading soon");
      
      // Add a small delay to allow other data to load
      const userDataTimer = setTimeout(() => {
        setDashboardLoading(false);
      }, 1000);
      
      return () => {
        clearTimeout(userDataTimer);
        clearTimeout(maxLoadingTimer);
      };
    }
    
    // Only redirect to login if truly not authenticated and not in loading state
    if (!isAuthenticated && !authLoading && !user) {
      console.log("Not authenticated, redirecting to login");
      navigate('/user-login');
    }

    return () => clearTimeout(maxLoadingTimer);
  }, [isAuthenticated, navigate, currentUser, authLoading, user, dashboardLoading]);

  // Check if there's a session but no profile, which could indicate a database error
  useEffect(() => {
    const checkForOrphanedSession = async () => {
      if (!currentUser && !authLoading && dashboardLoading) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("Session exists but no profile found, attempting to fetch profile");
          
          // Try to refresh the page to trigger a new profile fetch
          if (!loadingTimedOut) {
            setLoadingTimedOut(true);
          }
        }
      }
    };
    
    checkForOrphanedSession();
  }, [currentUser, authLoading, dashboardLoading, loadingTimedOut]);

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
