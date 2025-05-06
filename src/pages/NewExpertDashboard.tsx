
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import PlaceholderPage from '@/components/expert-dashboard/pages/PlaceholderPage';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const NewExpertDashboard: React.FC = () => {
  const { expertProfile, isAuthenticated, role, isLoading } = useAuth();
  
  // Debug logging to track authentication status
  useEffect(() => {
    console.log('NewExpertDashboard - Auth state:', {
      isAuthenticated,
      role,
      hasExpertProfile: !!expertProfile,
      isLoading
    });
  }, [isAuthenticated, role, expertProfile, isLoading]);
  
  // If not authenticated or not an expert, this condition will be handled by ExpertDashboardLayout
  // but we add an extra check here as well
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || role !== 'expert' || !expertProfile) {
    console.error('User not authenticated as expert, redirecting to expert login');
    toast.error('You must be logged in as an expert to access this page');
    return <Navigate to="/expert-login" replace />;
  }

  return (
    <ExpertDashboardLayout>
      <Routes>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />
        
        {/* Phase 1 Pages */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Placeholders for Future Phases */}
        <Route 
          path="schedule" 
          element={
            <PlaceholderPage 
              title="Schedule Management" 
              description="Manage your availability and appointments" 
              phase={4}
            />
          } 
        />
        <Route 
          path="messages" 
          element={
            <PlaceholderPage 
              title="Messages" 
              description="Communicate with clients and administrators" 
              phase={6}
            />
          } 
        />
        <Route 
          path="documents" 
          element={
            <PlaceholderPage 
              title="Documents" 
              description="Manage your professional documents and resources" 
              phase={3}
            />
          } 
        />
        <Route 
          path="earnings" 
          element={
            <PlaceholderPage 
              title="Earnings" 
              description="Track your earnings and financial performance" 
              phase={5}
            />
          } 
        />
        <Route 
          path="settings" 
          element={
            <PlaceholderPage 
              title="Settings" 
              description="Manage your account settings and preferences" 
              phase={2}
            />
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default NewExpertDashboard;
