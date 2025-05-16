
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import LoadingScreen from '@/components/auth/LoadingScreen';
import UserDashboardContent from '@/components/user-dashboard/UserDashboardContent';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('UserDashboard: Checking authentication...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          console.log('UserDashboard: Session found, setting user');
          setUser(data.session.user);
          
          // Ensure session type is set
          localStorage.setItem('sessionType', 'user');
        } else {
          console.log('UserDashboard: No session found, redirecting to login');
          navigate('/user-login', { replace: true });
        }
      } catch (error) {
        console.error('UserDashboard: Auth check error:', error);
        toast.error('Authentication error');
        navigate('/user-login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('UserDashboard: Auth state changed:', event);
        
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          navigate('/user-login', { replace: true });
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  if (!user) {
    return <LoadingScreen message="Redirecting to login..." />;
  }
  
  return <UserDashboardContent user={user} />;
};

export default UserDashboard;
