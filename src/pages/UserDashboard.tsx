
import React from 'react';
import UserDashboard from '@/components/user/dashboard/UserDashboard';
import { useAuth } from '@/contexts/auth';
import LoadingScreen from '@/components/auth/LoadingScreen';

// This page component ensures the user profile is loaded before rendering the dashboard
const UserDashboardPage: React.FC = () => {
  const { isLoading, profile, userProfile, user, isAuthenticated } = useAuth();
  
  console.log('UserDashboardPage: Auth state:', { 
    isLoading, 
    hasProfile: !!profile, 
    hasUserProfile: !!userProfile, 
    hasUser: !!user,
    isAuthenticated
  });
  
  // Show loading screen while profile is loading
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  // If we have any profile data, render the dashboard
  if (profile || userProfile) {
    return <UserDashboard />;
  }
  
  // If there's no profile but we're authenticated, try to render anyway
  if (isAuthenticated && user) {
    console.log('No profile but authenticated, attempting to render dashboard anyway');
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
