
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import SimpleLogin from '@/components/auth/SimpleLogin';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('Already logged in, redirecting to dashboard...');
          // Get session type from localStorage
          const sessionType = localStorage.getItem('sessionType') || 'user';
          
          if (sessionType === 'user') {
            navigate('/user-dashboard', { replace: true });
          } else if (sessionType === 'expert') {
            navigate('/expert-dashboard', { replace: true });
          } else if (sessionType === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            // Default fallback
            navigate('/user-dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  return (
    <Container className="max-w-md mx-auto py-12">
      <SimpleLogin />
    </Container>
  );
};

export default Login;
