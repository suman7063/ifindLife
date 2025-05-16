
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
  
  useEffect(() => {
    // Directly check for session with Supabase
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          console.log('Session found, user authenticated');
          setUser(session.user);
          
          // Ensure sessionType is set
          if (!localStorage.getItem('sessionType')) {
            localStorage.setItem('sessionType', 'user');
          }
        } else {
          console.log('No session found, redirecting to login');
          navigate('/user-login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Authentication error');
        navigate('/user-login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          navigate('/user-login', { replace: true });
        }
      }
    );
    
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
