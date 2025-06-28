
import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { isUserAuthenticated } from '@/utils/authHelpers';
import { Loader2 } from 'lucide-react';
import UserDashboardPages from './UserDashboardPages';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';
import ProfileSection from '@/components/user/dashboard/sections/ProfileSection';
import WalletSection from '@/components/user/dashboard/sections/WalletSection';
import ConsultationsSection from '@/components/user/dashboard/sections/ConsultationsSection';
import FavoritesSection from '@/components/user/dashboard/sections/FavoritesSection';
import MessagesSection from '@/components/user/dashboard/sections/MessagesSection';
import SecuritySection from '@/components/user/dashboard/sections/SecuritySection';
import SettingsSection from '@/components/user/dashboard/sections/SettingsSection';
import SupportSection from '@/components/user/dashboard/sections/SupportSection';
import ProgramsSection from '@/components/user/dashboard/sections/ProgramsSection';
import BookingHistorySection from '@/components/user/dashboard/sections/BookingHistorySection';
import ProgressTrackingSection from '@/components/user/dashboard/sections/ProgressTrackingSection';

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

  const handleLogout = async () => {
    try {
      await simpleAuth.logout();
      navigate('/user-login');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Ensure we have a valid user profile for the sidebar
  if (!simpleAuth.userProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading user profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <UserDashboardSidebar 
            user={simpleAuth.userProfile} 
            onLogout={handleLogout}
            isLoggingOut={false}
          />
          
          {/* Main Content */}
          <div className="flex-1 p-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  <UserDashboardPages 
                    currentUser={simpleAuth.userProfile} 
                    onNavigate={handleNavigation} 
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={<ProfileSection />} 
              />
              <Route 
                path="/wallet" 
                element={<WalletSection />} 
              />
              <Route 
                path="/programs" 
                element={<ProgramsSection />} 
              />
              <Route 
                path="/booking-history" 
                element={<BookingHistorySection />} 
              />
              <Route 
                path="/progress" 
                element={<ProgressTrackingSection />} 
              />
              <Route 
                path="/favorites" 
                element={<FavoritesSection />} 
              />
              <Route 
                path="/messages" 
                element={<MessagesSection />} 
              />
              <Route 
                path="/security" 
                element={<SecuritySection />} 
              />
              <Route 
                path="/settings" 
                element={<SettingsSection />} 
              />
              <Route 
                path="/support" 
                element={<SupportSection />} 
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
