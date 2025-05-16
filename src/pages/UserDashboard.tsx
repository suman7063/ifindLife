
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import useDashboardState from '@/hooks/user-dashboard/useDashboardState';
import UserDashboardContent from '@/components/user-dashboard/UserDashboardContent';
import { toast } from 'sonner';

const UserDashboard: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dashboardState = useDashboardState();
  
  // Use a more robust authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        console.log('UserDashboard: Direct auth check with Supabase...');
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('UserDashboard: Active session found, user authenticated');
          setIsAuthenticated(true);
          
          // Set session type to user for this page
          localStorage.setItem('sessionType', 'user');
        } else {
          console.log('UserDashboard: No active session found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('Authentication verification failed');
        setIsAuthenticated(false);
      } finally {
        // Add a small delay before setting isChecking to false
        // to prevent flickering during authentication state changes
        setTimeout(() => {
          setIsChecking(false);
        }, 500);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading screen during auth check
  if (isChecking) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('UserDashboard: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render the dashboard content
  console.log('UserDashboard: User is authenticated, rendering dashboard');
  return <UserDashboardContent {...dashboardState} />;
};

export default UserDashboard;
