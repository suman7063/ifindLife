
import React, { ReactNode, useEffect } from 'react';
import ExpertSidebar from './sidebar/ExpertSidebar';
import ExpertHeader from './ExpertHeader';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLoader from '../../expert/dashboard/DashboardLoader';
import { toast } from 'sonner';

interface ExpertDashboardLayoutProps {
  children: ReactNode;
}

const ExpertDashboardLayout: React.FC<ExpertDashboardLayoutProps> = ({ children }) => {
  const { isLoading, expertProfile, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Enhanced debug logging
  useEffect(() => {
    console.log('ExpertDashboardLayout auth state:', {
      isLoading,
      role,
      isAuthenticated,
      hasExpertProfile: !!expertProfile
    });
    
    // Ensure we're in expert mode
    if (isAuthenticated && expertProfile) {
      localStorage.setItem('sessionType', 'expert');
    }
    
    // Handle edge case where user is authenticated but not as expert
    if (!isLoading && isAuthenticated && role !== 'expert') {
      console.log('User authenticated but not as expert');
      toast.error('You do not have expert privileges');
      navigate('/user-dashboard', { replace: true });
    }
  }, [isLoading, role, isAuthenticated, expertProfile, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <DashboardLoader />;
  }
  
  // Handle unauthorized access
  if (!isAuthenticated || role !== 'expert' || !expertProfile) {
    console.log('Not authenticated as expert, redirecting to expert login', {
      isAuthenticated,
      role,
      hasExpertProfile: !!expertProfile
    });
    return <Navigate to="/expert-login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar />
      
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
