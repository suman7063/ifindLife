
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import PlaceholderPage from '@/components/expert-dashboard/pages/PlaceholderPage';
import { useAuth } from '@/contexts/auth/AuthContext';

const NewExpertDashboard: React.FC = () => {
  const { expertProfile, isAuthenticated, role } = useAuth();
  
  // If not authenticated or not an expert, this condition will be handled by ExpertDashboardLayout
  // but we add an extra check here as well
  if (!isAuthenticated || role !== 'expert' || !expertProfile) {
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
