
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from '@/components/user/dashboard/UserDashboard';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';

const UserDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check auth status directly with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }
  
  return <UserDashboard />;
};

export default UserDashboardPage;
