
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardContent from '@/components/user-dashboard/UserDashboardContent';

const UserDashboard: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Check authentication directly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        
        // Add a small delay to ensure auth state is fully processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('UserDashboard: Checking authentication...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          toast.error('Authentication check failed');
          setIsAuthenticated(false);
          setIsChecking(false);
          return;
        }
        
        if (data.session) {
          console.log('UserDashboard: User is authenticated');
          setUser(data.session.user);
          setIsAuthenticated(true);
        } else {
          console.log('UserDashboard: No active session found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Show loading screen during auth check
  if (isChecking) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('UserDashboard: User not authenticated, redirecting to login');
    return <Navigate to="/user-login" replace />;
  }
  
  // Render the dashboard content if authenticated
  return <UserDashboardContent user={user} />;
};

export default UserDashboard;
