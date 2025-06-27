
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import SchedulePage from '@/components/expert-dashboard/pages/SchedulePage';
import ClientsPage from '@/components/expert-dashboard/pages/ClientsPage';
import MessagingPage from '@/components/expert-dashboard/pages/MessagingPage';
import ServicesPage from '@/components/expert-dashboard/pages/ServicesPage';
import EarningsPage from '@/components/expert-dashboard/pages/EarningsPage';
import ReportPage from '@/components/expert-dashboard/pages/ReportPage';
import AnalyticsPage from '@/components/expert-dashboard/pages/analytics/AnalyticsPage';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Loader2 } from 'lucide-react';

const ExpertDashboard = () => {
  const { isAuthenticated, userType, expert, isLoading } = useSimpleAuth();
  
  console.log('ExpertDashboard - Auth state:', {
    isAuthenticated,
    userType,
    hasExpertProfile: !!expert,
    isLoading,
    expertStatus: expert?.status
  });

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading expert dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle unauthorized access - redirect to expert login
  if (!isAuthenticated || userType !== 'expert' || !expert) {
    console.log('ExpertDashboard: Unauthorized access, redirecting to expert login');
    return <Navigate to="/expert-login" replace />;
  }

  // Handle non-approved expert status
  if (expert.status !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Account Status: {expert.status}</h2>
          {expert.status === 'pending' && (
            <p className="text-gray-600">Your expert account is pending approval. You will be notified once approved.</p>
          )}
          {expert.status === 'disapproved' && (
            <p className="text-gray-600">Your expert account application has been disapproved. Please check your email for details.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <ExpertDashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="messages" element={<MessagingPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportPage />} />
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default ExpertDashboard;
