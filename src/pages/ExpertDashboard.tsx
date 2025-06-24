
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';

const ExpertDashboard: React.FC = () => {
  const { isAuthenticated, sessionType, expertProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'profile' | 'appointments' | 'earnings' | 'settings'>('dashboard');

  console.log('ExpertDashboard: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasExpertProfile: Boolean(expertProfile),
    isLoading: Boolean(isLoading),
    expertStatus: expertProfile?.status
  });

  useEffect(() => {
    if (!isLoading) {
      // Check if expert is authenticated
      if (!isAuthenticated || sessionType !== 'expert' || !expertProfile) {
        console.log('ExpertDashboard: Not authenticated as expert, redirecting');
        toast.error('You must be logged in as an expert to access this page');
        navigate('/expert-login', { replace: true });
        return;
      }

      // Check expert status
      if (expertProfile.status === 'pending') {
        toast.info('Your expert account is pending approval');
      } else if (expertProfile.status === 'rejected') {
        toast.error('Your expert account has been rejected. Please contact support.');
      }
    }
  }, [isAuthenticated, sessionType, expertProfile, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen message="Loading expert dashboard..." />;
  }

  // If not authenticated as expert, don't render anything (redirect will happen)
  if (!isAuthenticated || sessionType !== 'expert' || !expertProfile) {
    return <LoadingScreen message="Redirecting to login..." />;
  }

  const renderContent = () => {
    switch (view) {
      case 'profile':
        return <ProfilePage />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  return (
    <ExpertDashboardLayout>
      {renderContent()}
    </ExpertDashboardLayout>
  );
};

export default ExpertDashboard;
