
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import UserLoginContent from './UserLoginContent';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import UserLoginHeader from './UserLoginHeader';

const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check for pending actions after login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const pendingAction = sessionStorage.getItem('pendingAction');
      const pendingProgramId = sessionStorage.getItem('pendingProgramId');
      const returnPath = sessionStorage.getItem('returnPath');
      
      // Clear session storage to prevent repeating the action
      sessionStorage.removeItem('pendingAction');
      sessionStorage.removeItem('pendingProgramId');
      
      // Redirect to the saved path or dashboard
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Container className="py-8 md:py-12">
      <Card className="border shadow-lg max-w-md mx-auto">
        <CardContent className="pt-6">
          <UserLoginHeader />
          <UserLoginContent />
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserLoginPage;
