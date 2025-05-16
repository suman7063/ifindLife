
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { getRedirectPath } from '@/utils/directAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Set login origin to 'user' to ensure correct role determination
  useEffect(() => {
    sessionStorage.setItem('loginOrigin', 'user');
    console.log('Login: Setting login origin to user');
  }, []);

  // Check if already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('Login: User already has an active session');
          setIsAuthenticated(true);
          
          // Add a small delay to ensure auth state is fully processed before redirect
          setTimeout(() => {
            const redirectPath = getRedirectPath();
            console.log('Login: Redirecting to', redirectPath);
            navigate(redirectPath, { replace: true });
          }, 500);
        } else {
          console.log('Login: No active session found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
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
  
  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return <LoadingScreen message="Redirecting..." />;
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
