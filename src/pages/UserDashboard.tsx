
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticated } from '@/utils/authHelpers';

const UserDashboard = () => {
  const simpleAuth = useSimpleAuth();
  const navigate = useNavigate();
  
  console.log('UserDashboard: Starting with auth state:', simpleAuth);

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

  // Check if user is authenticated
  if (!isUserAuthenticated(simpleAuth)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p>Please log in to access your dashboard.</p>
            <button 
              onClick={() => navigate('/user-login')}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p>Email: {simpleAuth.user?.email}</p>
          <p>User ID: {simpleAuth.user?.id}</p>
          <p>User Type: {simpleAuth.userType}</p>
          
          {simpleAuth.userProfile && (
            <div className="mt-4">
              <h3 className="font-semibold">Profile Information:</h3>
              <p>Name: {simpleAuth.userProfile.name}</p>
              <p>Phone: {simpleAuth.userProfile.phone}</p>
              <p>Country: {simpleAuth.userProfile.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
