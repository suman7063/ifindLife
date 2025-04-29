
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, role } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'user') {
        navigate('/user-dashboard');
      } else if (role === 'expert') {
        navigate('/expert-dashboard');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, isLoading, role, navigate]);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }
  
  return (
    <Container className="max-w-md mx-auto py-12">
      <UserLoginHeader />
      <UserLoginContent />
    </Container>
  );
};

export default Login;
