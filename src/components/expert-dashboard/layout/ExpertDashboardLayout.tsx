
import React, { ReactNode, useEffect, useState } from 'react';
import ExpertSidebar from './sidebar/ExpertSidebar';
import ExpertHeader from './ExpertHeader';
import MobileResponsiveWrapper from './MobileResponsiveWrapper';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLoader from '../../expert/dashboard/DashboardLoader';
import { toast } from 'sonner';
import { isExpertAuthenticated } from '@/utils/authHelpers';

interface ExpertDashboardLayoutProps {
  children: ReactNode;
}

// Simple redirect safety to prevent infinite loops
class RedirectSafety {
  private redirectCount = 0;
  private lastRedirectTime = 0;
  private readonly MAX_REDIRECTS = 3;
  private readonly RESET_TIME = 5000; // 5 seconds

  canRedirect(from: string, to: string): boolean {
    const now = Date.now();
    
    // Reset counter if enough time has passed
    if (now - this.lastRedirectTime > this.RESET_TIME) {
      this.redirectCount = 0;
    }

    // Check if we've hit the limit
    if (this.redirectCount >= this.MAX_REDIRECTS) {
      console.error(`Redirect loop detected: ${from} -> ${to}. Blocking redirect.`);
      return false;
    }

    this.redirectCount++;
    this.lastRedirectTime = now;
    return true;
  }

  reset() {
    this.redirectCount = 0;
    this.lastRedirectTime = 0;
  }
}

const redirectSafety = new RedirectSafety();

const ExpertDashboardLayout: React.FC<ExpertDashboardLayoutProps> = ({ children }) => {
  const simpleAuth = useSimpleAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  // Enhanced debug logging
  console.log('ExpertDashboardLayout - Simple auth state:', {
    isAuthenticated: simpleAuth.isAuthenticated,
    userType: simpleAuth.userType,
    hasExpertProfile: !!simpleAuth.expert,
    isLoading: simpleAuth.isLoading,
    expertStatus: simpleAuth.expert?.status
  });
  
  // Show loading state while checking authentication
  if (simpleAuth.isLoading) {
    return <DashboardLoader />;
  }
  
  // Handle unauthorized access with redirect safety
  if (!isExpertAuthenticated(simpleAuth)) {
    console.log('ExpertDashboardLayout: Not authenticated as expert, checking redirect safety');
    
    if (!hasRedirected && redirectSafety.canRedirect('/expert-dashboard', '/expert-login')) {
      console.log('ExpertDashboardLayout: Redirecting to expert login');
      setHasRedirected(true);
      return <Navigate to="/expert-login" replace />;
    } else if (!redirectSafety.canRedirect('/expert-dashboard', '/expert-login')) {
      // If redirect is blocked due to loop detection, show error
      console.error('ExpertDashboardLayout: Redirect loop detected, showing error');
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-4">
              There seems to be an authentication issue. Please try logging in again.
            </p>
            <button 
              onClick={() => {
                redirectSafety.reset();
                navigate('/expert-login', { replace: true });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    
    // Fallback if redirect safety prevents redirect
    return <Navigate to="/expert-login" replace />;
  }

  // Handle edge case where user is authenticated but not as expert
  useEffect(() => {
    if (!simpleAuth.isLoading && simpleAuth.isAuthenticated && simpleAuth.userType !== 'expert') {
      console.log('ExpertDashboardLayout: User authenticated but not as expert');
      toast.error('You do not have expert privileges');
      navigate('/user-dashboard', { replace: true });
    }
  }, [simpleAuth.isLoading, simpleAuth.isAuthenticated, simpleAuth.userType, navigate]);

  return (
    <MobileResponsiveWrapper className="bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ExpertHeader />
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </MobileResponsiveWrapper>
  );
};

export default ExpertDashboardLayout;
