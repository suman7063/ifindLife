
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import UserLoginTabs from '@/components/auth/UserLoginTabs';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading: userLoading } = useUserAuth();
  const { isExpertAuthenticated, isAuthLoading } = useAuthSynchronization();
  
  // Redirect if already authenticated
  useEffect(() => {
    // If user is authenticated, redirect to user dashboard
    if (!userLoading && isAuthenticated && currentUser) {
      navigate('/user-dashboard');
      return;
    }
    
    // If expert is authenticated, redirect to expert dashboard
    if (isExpertAuthenticated) {
      navigate('/expert-dashboard');
      return;
    }
  }, [currentUser, isAuthenticated, userLoading, isExpertAuthenticated, navigate]);
  
  // Show loading screen while checking authentication
  if (isAuthLoading) {
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
