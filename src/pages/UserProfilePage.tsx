
import React from 'react';
import { Container } from '@/components/ui/container';
import UserProfile from '@/components/user/profile/UserProfile';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/auth/AuthContext';
import { redirect, useNavigate } from 'react-router-dom';

const UserProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Don't render anything while checking authentication
  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </Container>
    );
  }
  
  // If not authenticated after loading, don't render content
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Your Profile | iFindLife</title>
      </Helmet>
      
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          <UserProfile />
        </div>
      </Container>
    </>
  );
};

export default UserProfilePage;
