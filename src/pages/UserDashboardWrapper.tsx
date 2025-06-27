
import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticated } from '@/utils/authHelpers';
import { Loader2 } from 'lucide-react';
import UserDashboardPages from './UserDashboardPages';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';

const UserDashboardWrapper = () => {
  const simpleAuth = useSimpleAuth();
  const navigate = useNavigate();
  
  console.log('UserDashboardWrapper: Starting with auth state:', {
    isAuthenticated: simpleAuth.isAuthenticated,
    userType: simpleAuth.userType,
    hasUserProfile: !!simpleAuth.userProfile,
    isLoading: simpleAuth.isLoading
  });

  if (simpleAuth?.isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Check if user is authenticated
  if (!isUserAuthenticated(simpleAuth)) {
    return (
      <>
        <Navbar />
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
        <Footer />
      </>
    );
  }

  const handleNavigation = (section: string) => {
    console.log('UserDashboardWrapper: Navigating to section:', section);
    // Handle navigation logic here if needed
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <UserDashboardSidebar />
          
          {/* Main Content */}
          <div className="flex-1 p-8">
            <Routes>
              <Route 
                path="/*" 
                element={
                  <UserDashboardPages 
                    currentUser={simpleAuth.userProfile} 
                    onNavigate={handleNavigation} 
                  />
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboardWrapper;
