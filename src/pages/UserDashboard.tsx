
import React from 'react';
import UserDashboard from '@/components/user/dashboard/UserDashboard';
import { useAuth } from '@/contexts/auth';
import LoadingScreen from '@/components/auth/LoadingScreen';

// This page component ensures the user profile is loaded before rendering the dashboard
const UserDashboardPage: React.FC = () => {
  const { isLoading, profile } = useAuth();
  
  // Show loading screen while profile is loading
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  // If we have a profile, render the dashboard
  if (profile) {
    return <UserDashboard />;
  }
  
  // If there's no profile but we're not loading, something went wrong
  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to load user profile</h2>
      <p>Please try refreshing the page or logging in again.</p>
    </div>
  );
};

export default UserDashboardPage;
