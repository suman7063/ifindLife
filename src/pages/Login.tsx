
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading, role } = useAuth();
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);
  
  // Check for pending actions in session storage
  useEffect(() => {
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (pendingActionStr) {
      try {
        const action = JSON.parse(pendingActionStr);
        setPendingAction(action);
        console.log("Login - Found pending action:", action);
      } catch (error) {
        console.error('Error parsing pending action:', error);
        sessionStorage.removeItem('pendingAction');
      }
    }
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Login - User is authenticated, checking for pending actions");
      
      // Handle pending actions if they exist
      const pendingActionStr = sessionStorage.getItem('pendingAction');
      if (pendingActionStr) {
        try {
          const action = JSON.parse(pendingActionStr);
          
          if (action.type === 'book' && action.id) {
            console.log("Login - Redirecting to booking page for expert:", action.id);
            // Clear the pending action
            sessionStorage.removeItem('pendingAction');
            // Redirect to the expert booking page
            navigate(`/experts/${action.id}?book=true`, { replace: true });
            return;
          }
          
          if (action.type === 'call' && action.id) {
            console.log("Login - Redirecting to call page for expert:", action.id);
            // Clear the pending action
            sessionStorage.removeItem('pendingAction');
            // Redirect to the expert call page
            navigate(`/experts/${action.id}?call=true`, { replace: true });
            return;
          }
          
          if (action.path) {
            console.log("Login - Redirecting to stored path:", action.path);
            // Clear the pending action
            sessionStorage.removeItem('pendingAction');
            // Redirect to the stored path
            navigate(action.path, { replace: true });
            return;
          }
        } catch (error) {
          console.error('Error handling pending action after login:', error);
          sessionStorage.removeItem('pendingAction');
        }
      }
      
      // Default redirects by role
      if (role === 'expert') {
        console.log("Login - Redirecting to expert dashboard");
        navigate('/expert-dashboard', { replace: true });
      } else if (role === 'user') {
        console.log("Login - Redirecting to user dashboard");
        navigate('/user-dashboard', { replace: true });
      } else if (role === 'admin') {
        console.log("Login - Redirecting to admin dashboard");
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, role, navigate, pendingAction]);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }
  
  return (
    <Container className="max-w-md mx-auto py-12">
      {pendingAction && (
        <Alert className="mb-4">
          <AlertDescription>
            After login, you'll be returned to continue your {
              pendingAction.type === 'book' ? 'booking' : 
              pendingAction.type === 'call' ? 'call' : 
              pendingAction.type === 'favorite' ? 'favoriting' : 'previous'
            } action.
          </AlertDescription>
        </Alert>
      )}
      <UserLoginHeader />
      <UserLoginContent />
    </Container>
  );
};

export default Login;
