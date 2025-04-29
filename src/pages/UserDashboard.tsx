
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import DashboardHome from '@/components/user/dashboard/DashboardHome';
import UserProfileSection from '@/components/user/dashboard/UserProfileSection';
import WalletSection from '@/components/user/dashboard/WalletSection';
import ConsultationsSection from '@/components/user/dashboard/ConsultationsSection';
import FavoritesSection from '@/components/user/dashboard/FavoritesSection';
import ReviewsSection from '@/components/user/dashboard/ReviewsSection';
import ReferralsSection from '@/components/user/dashboard/ReferralsSection';
import DashboardLoader from '@/components/user/dashboard/DashboardLoader';

const UserDashboard: React.FC = () => {
  const { userProfile, isAuthenticated, isLoading, role, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Handle logout process
  const handleLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      console.log("UserDashboard - Logging out");
      const success = await logout();
      
      if (success) {
        toast.success('Successfully logged out');
        return true;
      } else {
        toast.error('Error logging out');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <DashboardLoader />;
  }

  // Don't render dashboard content if not authenticated or not a user
  if (!isAuthenticated || role !== 'user') {
    return <Navigate to="/user-login" replace />;
  }

  return (
    <Routes>
      <Route 
        element={
          <UserDashboardLayout
            user={userProfile}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        }
      >
        <Route index element={<DashboardHome user={userProfile} />} />
        <Route path="profile" element={<UserProfileSection user={userProfile} />} />
        <Route path="wallet" element={<WalletSection user={userProfile} />} />
        <Route path="consultations" element={<ConsultationsSection user={userProfile} />} />
        <Route path="favorites" element={<FavoritesSection user={userProfile} />} />
        <Route path="reviews" element={<ReviewsSection user={userProfile} />} />
        <Route path="referrals" element={<ReferralsSection user={userProfile} />} />
        <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default UserDashboard;
