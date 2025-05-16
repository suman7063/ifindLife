
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '@/modules/authentication';
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
        const authResult = await authenticate.checkSession();
        
        if (!authResult.isAuthenticated) {
          console.log('UserDashboard: Not authenticated, redirecting to login');
          navigate('/user-login', { replace: true });
          return;
        }
        
        if (authResult.role !== 'user') {
          console.log(`UserDashboard: Incorrect role (${authResult.role}), redirecting`);
          navigate('/user-login', { replace: true });
          return;
        }
        
        // Get user data from Supabase session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('UserDashboard: Session found, setting user');
          setUser(data.session.user);
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
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/user-login', { replace: true });
        } else if (session) {
          setUser(session.user);
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
