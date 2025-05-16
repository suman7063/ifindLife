
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardContent from '@/components/user-dashboard/UserDashboardContent';

const UserDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // Direct authentication check on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('UserDashboard: Checking auth session...');
        // Add a small delay to ensure auth state is fully processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          toast.error('Authentication check failed');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('UserDashboard: Session found, user authenticated');
          setUser(data.session.user);
          setIsAuthenticated(true);
        } else {
          console.log('UserDashboard: No session found');
          setIsAuthenticated(false);
          
          // Redirect after state update
          setTimeout(() => {
            console.log('UserDashboard: Redirecting to login...');
            navigate('/user-login', { replace: true });
          }, 100);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  // Show dashboard content if authenticated
  if (isAuthenticated && user) {
    return <UserDashboardContent user={user} />;
  }
  
  // This should rarely be visible due to the redirect in the useEffect
  return <Navigate to="/user-login" replace />;
};

export default UserDashboard;
