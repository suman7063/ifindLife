
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import useDashboardState from '@/hooks/user-dashboard/useDashboardState';
import UserDashboardContent from '@/components/user-dashboard/UserDashboardContent';

const UserDashboard: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dashboardState = useDashboardState();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isChecking) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    console.log('UserDashboard: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <UserDashboardContent {...dashboardState} />;
};

export default UserDashboard;
