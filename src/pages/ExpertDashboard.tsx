
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // Use unified auth context
  const { isAuthenticated, sessionType, expert, isLoading } = useUnifiedAuth();
  
  console.log('ExpertDashboard - Unified auth state:', {
    isAuthenticated,
    sessionType,
    hasExpertProfile: !!expert,
    isLoading,
    redirectAttempted
  });

  useEffect(() => {
    // Wait for loading to complete
    if (isLoading) {
      console.log('ExpertDashboard: Still loading, waiting...');
      return;
    }

    // Check authentication status
    if (!isAuthenticated || sessionType !== 'expert' || !expert) {
      if (!redirectAttempted) {
        console.log('ExpertDashboard: Not authenticated as expert, redirecting to expert login');
        setRedirectAttempted(true);
        navigate('/expert-login');
      }
      return;
    }

    // If we get here, expert is authenticated and has profile
    console.log('ExpertDashboard: Expert is authenticated and has profile, showing dashboard');
    
  }, [isAuthenticated, sessionType, expert, isLoading, navigate, redirectAttempted]);

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

  // Show loading state during redirect
  if (!isAuthenticated || sessionType !== 'expert' || !expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Expert is authenticated and has profile - show dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {expert.name || expert.email}! Manage your expert services and consultations.
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Status Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Profile Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {expert.status === 'approved' ? 'Verified Expert' : expert.status || 'Pending'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Services
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Available
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Consultations Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Consultations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
              <div className="mt-5">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your recent consultations and services will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info (Remove in production) */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
          <strong>Debug Info:</strong><br/>
          Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br/>
          Session Type: {sessionType || 'None'}<br/>
          Has Expert Profile: {expert ? 'Yes' : 'No'}<br/>
          Loading: {isLoading ? 'Yes' : 'No'}<br/>
          Redirect Attempted: {redirectAttempted ? 'Yes' : 'No'}<br/>
          Expert Status: {expert?.status || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
