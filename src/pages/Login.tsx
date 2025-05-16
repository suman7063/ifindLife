
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { checkAuthStatus, getRedirectPath } from '@/utils/directAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading: contextLoading } = useAuth();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  
  // Check for authenticated session without relying on context
  useEffect(() => {
    const verifySession = async () => {
      setLocalLoading(true);
      
      try {
        console.log("Login page: Verifying authentication status");
        const { isAuthenticated } = await checkAuthStatus();
        
        if (isAuthenticated) {
          console.log("Login page: User is authenticated, handling redirect");
          
          // Add a small delay to ensure auth state is fully processed
          setTimeout(() => {
            // Handle redirect using React Router
            const redirectPath = getRedirectPath();
            console.log("Login page: Redirecting to", redirectPath);
            navigate(redirectPath, { replace: true });
          }, 500);
        } else {
          console.log("Login page: User is not authenticated, showing login form");
        }
        
        setAuthCheckCompleted(true);
        setLocalLoading(false);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setAuthCheckCompleted(true);
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
  
  // Avoid showing loading screen unless necessary
  if (localLoading && !authCheckCompleted) {
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
