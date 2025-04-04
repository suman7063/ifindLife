import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import refactored components
import WalletBalanceCard from '@/components/user/dashboard/WalletBalanceCard';
import RecentTransactionsCard from '@/components/user/dashboard/RecentTransactionsCard';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';
import ProfileSetupPlaceholder from '@/components/user/dashboard/ProfileSetupPlaceholder';
import DashboardStatsGrid from '@/components/user/dashboard/DashboardStatsGrid';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import useDashboardState from '@/hooks/user-dashboard/useDashboardState';
import { useExpertAuth } from '@/hooks/expert-auth';

// Import existing components
import UserProfileCard from '@/components/user/UserProfileCard';
import UserReviewsCard from '@/components/user/UserReviewsCard';
import ReferralDashboardCard from '@/components/user/ReferralDashboardCard';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  const {
    currentUser,
    isAuthenticated,
    authLoading,
    user,
    dashboardLoading,
    loadingTimedOut,
    isRechargeDialogOpen,
    logout,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handlePaymentSuccess,
    handlePaymentCancel
  } = useDashboardState();
  
  // Get expert auth state
  const { currentExpert: expert, isLoading: loading } = useExpertAuth();

  // Debug logging
  useEffect(() => {
    console.log('UserDashboard - Auth states:', {
      userAuthLoading: authLoading,
      dashboardLoading,
      isAuthenticated,
      hasUserProfile: !!currentUser,
      hasUser: !!user,
      expertLoading,
      hasExpertProfile: !!expert,
      redirectAttempted
    });
  }, [authLoading, dashboardLoading, isAuthenticated, currentUser, user, expert, expertLoading, redirectAttempted]);
  
  // If expert is authenticated but not user, redirect to expert dashboard
  useEffect(() => {
    if (!dashboardLoading && !authLoading && !expertLoading && expert && !currentUser && !redirectAttempted) {
      console.log('Expert authenticated but not user, redirecting to expert dashboard');
      setRedirectAttempted(true);
      navigate('/expert-dashboard', { replace: true });
    }
  }, [expert, currentUser, dashboardLoading, authLoading, expertLoading, redirectAttempted, navigate]);

  // If neither user nor expert is authenticated, redirect to login
  useEffect(() => {
    if (!dashboardLoading && !authLoading && !expertLoading && !expert && !currentUser && !user && !redirectAttempted) {
      console.log('Not authenticated as user or expert, redirecting to user login');
      setRedirectAttempted(true);
      navigate('/user-login', { replace: true });
    }
  }, [expert, currentUser, user, dashboardLoading, authLoading, expertLoading, redirectAttempted, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  if (dashboardLoading || loading) {
    return <DashboardLoader />;
  }

  if (loadingTimedOut && !currentUser && user) {
    return (
      <ProfileSetupPlaceholder 
        user={user} 
        handleLogout={handleLogout} 
        isTimedOut={true} 
      />
    );
  }

  if (!isAuthenticated && !authLoading && !user) {
    console.log("Not authenticated (safety check), redirecting to login");
    navigate('/user-login');
    return null;
  }

  if (!currentUser && user) {
    return (
      <ProfileSetupPlaceholder 
        user={user} 
        handleLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, {currentUser?.name || user?.email?.split('@')[0] || 'User'}!</h1>
            <p className="text-gray-600">Here's an overview of your account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <UserProfileCard userProfile={currentUser} />
            <WalletBalanceCard userProfile={currentUser} onRecharge={handleOpenRechargeDialog} />
            <RecentTransactionsCard transactions={currentUser?.transactions || []} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <ReferralDashboardCard userProfile={currentUser || { id: user?.id || '', referralCode: '', email: user?.email || '' }} />
            <UserReviewsCard userProfile={currentUser} />
          </div>

          <RechargeDialog 
            isOpen={isRechargeDialogOpen}
            onClose={handleCloseRechargeDialog}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />

          <Separator className="my-6" />

          <DashboardStatsGrid userProfile={currentUser} />

          <Button onClick={handleLogout} className="mt-8 bg-ifind-aqua hover:bg-ifind-teal transition-colors">Logout</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
