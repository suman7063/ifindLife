
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import UserLoginHeader from '@/components/auth/UserLoginHeader';
import UserLoginContent from '@/components/auth/UserLoginContent';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PendingAction } from '@/hooks/useAuthJourneyPreservation';
import { supabase } from '@/lib/supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);
  
  // Check for authenticated session without relying on context
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Get the redirect location from session storage if it exists
        const pendingActionStr = sessionStorage.getItem('pendingAction');
        if (pendingActionStr) {
          try {
            const action = JSON.parse(pendingActionStr);
            sessionStorage.removeItem('pendingAction');
            
            if (action.path) {
              navigate(action.path, { replace: true });
              return;
            }
          } catch (error) {
            console.error('Error parsing pending action:', error);
          }
        }
        
        // Default redirects based on session type
        const sessionType = localStorage.getItem('sessionType');
        if (sessionType === 'expert') {
          navigate('/expert-dashboard', { replace: true });
        } else if (sessionType === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/user-dashboard', { replace: true });
        }
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
  
  // Use the context for loading state, but don't rely on it for authentication
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
