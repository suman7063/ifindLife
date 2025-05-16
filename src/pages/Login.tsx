
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { checkAuthStatus } from '@/utils/directAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  
  // Check for authenticated session without relying on context
  useEffect(() => {
    const verifySession = async () => {
      setLocalLoading(true);
      
      try {
        console.log("Login page: Verifying authentication status");
        const { isAuthenticated, session } = await checkAuthStatus();
        
        if (isAuthenticated && session) {
          console.log("Login page: User is authenticated, handling redirect");
          
          // Check for session type to determine the dashboard
          const sessionType = localStorage.getItem('sessionType');
          
          // Force immediate redirect based on session type
          console.log("Login page: Force redirecting based on session type:", sessionType);
          
          if (sessionType === 'expert') {
            window.location.href = '/expert-dashboard';
          } else if (sessionType === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/user-dashboard';
          }
          return;
        } else {
          console.log("Login page: User is not authenticated, showing login form");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setLocalLoading(false);
      }
    };
    
    verifySession();
  }, [navigate]);
  
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
  
  // Use the context for loading state, but don't rely on it for authentication
  if (isLoading || localLoading) {
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
