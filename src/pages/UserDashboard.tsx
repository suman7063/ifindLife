
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticated } from '@/utils/authHelpers';

const UserDashboard = () => {
  const simpleAuth = useSimpleAuth();
  const navigate = useNavigate();
  
  console.log('UserDashboard: Starting with auth state:', simpleAuth);

  // SIMPLIFIED APPROACH - Just show content if user exists
  if (simpleAuth?.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show dashboard content regardless of auth state (for debugging)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Status Debug</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {String(simpleAuth?.isLoading)}</p>
            <p><strong>Has User:</strong> {String(!!simpleAuth?.user)}</p>
            <p><strong>User Email:</strong> {simpleAuth?.user?.email || 'No email'}</p>
            <p><strong>Auth Helper Result:</strong> {String(isUserAuthenticated(simpleAuth))}</p>
          </div>
        </div>

        {simpleAuth?.user ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
            <p>Email: {simpleAuth.user.email}</p>
            <p>User ID: {simpleAuth.user.id}</p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">No User Data</h2>
            <p>The auth context doesn't contain user data.</p>
            <button 
              onClick={() => navigate('/user-login')}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
