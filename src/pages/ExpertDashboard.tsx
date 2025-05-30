
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import SchedulePage from '@/components/expert-dashboard/pages/SchedulePage';
import ClientsPage from '@/components/expert-dashboard/pages/ClientsPage';
import MessagingTab from '@/components/expert/dashboard/MessagingTab';
import ServicesPage from '@/components/expert-dashboard/pages/ServicesPage';
import EarningsPage from '@/components/expert-dashboard/pages/EarningsPage';
import ReportPage from '@/components/expert-dashboard/pages/ReportPage';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';

const ExpertDashboard = () => {
  const { isAuthenticated, sessionType, expert, isLoading } = useUnifiedAuth();
  
  console.log('ExpertDashboard - Unified auth state:', {
    isAuthenticated,
    sessionType,
    hasExpertProfile: !!expert,
    isLoading,
    expertStatus: expert?.status
  });

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expert dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle unauthorized access - ExpertDashboardLayout will handle the redirect
  if (!isAuthenticated || sessionType !== 'expert' || !expert) {
    return <Navigate to="/expert-login" replace />;
  }

  return (
    <ExpertDashboardLayout>
      <Routes>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />
        
        {/* Professional Profile Management */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Consultation Schedule and Availability Management */}
        <Route path="schedule" element={<SchedulePage />} />
        
        {/* Client Management with History and Notes */}
        <Route path="clients" element={<ClientsPage />} />
        
        {/* Messaging */}
        <Route path="messages" element={<MessagingTab />} />
        
        {/* Service Offering Management with Pricing Control */}
        <Route path="services" element={<ServicesPage />} />
        
        {/* Earnings Tracking and Payout Management */}
        <Route path="earnings" element={<EarningsPage />} />
        
        {/* User Reporting System for Inappropriate Behavior */}
        <Route path="reports" element={<ReportPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default ExpertDashboard;
