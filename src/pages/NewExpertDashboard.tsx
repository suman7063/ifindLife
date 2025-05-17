
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import SchedulePage from '@/components/expert-dashboard/pages/SchedulePage';
import ClientsPage from '@/components/expert-dashboard/pages/ClientsPage';
import MessagingTab from '@/components/expert/dashboard/MessagingTab';
import ServicesPage from '@/components/expert-dashboard/pages/ServicesPage';
import EarningsPage from '@/components/expert-dashboard/pages/EarningsPage';
import ReportPage from '@/components/expert-dashboard/pages/ReportPage';
import { useExpertAuth } from '@/hooks/expert-auth/useExpertAuth';
import { toast } from 'sonner';

const NewExpertDashboard: React.FC = () => {
  // Use our fixed useExpertAuth hook
  const { currentExpert, isAuthenticated, isLoading } = useExpertAuth();
  const navigate = useNavigate();
  
  // Debug logging to track authentication status
  useEffect(() => {
    console.log('NewExpertDashboard - Auth state:', {
      isAuthenticated,
      hasExpertProfile: !!currentExpert,
      isLoading
    });
    
    // Ensure role is set to expert when accessing this page
    if (isAuthenticated) {
      console.log('Setting preferred role to expert');
      localStorage.setItem('preferredRole', 'expert');
    }
  }, [isAuthenticated, currentExpert, isLoading]);
  
  // If not authenticated or not an expert, redirect to login
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || !currentExpert) {
    console.error('User not authenticated as expert, redirecting to expert login');
    toast.error('You must be logged in as an expert to access this page');
    return <Navigate to="/expert-login" replace />;
  }

  return (
    <ExpertDashboardLayout>
      <Routes>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />
        
        {/* Profile Management */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Schedule Management */}
        <Route path="schedule" element={<SchedulePage />} />
        
        {/* Client Management */}
        <Route path="clients" element={<ClientsPage />} />
        
        {/* Messaging */}
        <Route path="messages" element={<MessagingTab />} />
        
        {/* Services Management */}
        <Route path="services" element={<ServicesPage />} />
        
        {/* Earnings */}
        <Route path="earnings" element={<EarningsPage />} />
        
        {/* User Reports */}
        <Route path="reports" element={<ReportPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default NewExpertDashboard;
