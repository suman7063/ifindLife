
import React, { ReactNode } from 'react';
import ExpertSidebar from './sidebar/ExpertSidebar';
import ExpertHeader from './ExpertHeader';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLoader from '../../expert/dashboard/DashboardLoader';

interface ExpertDashboardLayoutProps {
  children: ReactNode;
}

const ExpertDashboardLayout: React.FC<ExpertDashboardLayoutProps> = ({ children }) => {
  const { isLoading, expertProfile, role, isAuthenticated } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <DashboardLoader />;
  }
  
  // If not authenticated or not an expert, redirect
  if (!isAuthenticated || role !== 'expert' || !expertProfile) {
    return <Navigate to="/expert-login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar expert={expertProfile} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ExpertHeader expert={expertProfile} />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboardLayout;
