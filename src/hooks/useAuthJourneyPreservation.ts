
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

export type PendingAction = {
  type: 'favorite' | 'book' | 'call' | 'connect' | 'navigate' | string;
  id?: string | number;
  data?: {
    path?: string;
    expertName?: string;
    callType?: 'video' | 'voice';
    action?: string;
    [key: string]: any;
  };
};

export const useAuthJourneyPreservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user, session, sessionType } = useAuth();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Check for pending actions in sessionStorage
  useEffect(() => {
    if (!isLoading) {
      const pendingActionStr = sessionStorage.getItem('pendingAction');
      const returnPath = sessionStorage.getItem('returnPath');
      
      if (pendingActionStr) {
        try {
          const action = JSON.parse(pendingActionStr);
          setPendingAction(action);
          console.log('Found pending action:', action);
        } catch (error) {
          console.error('Error parsing pending action:', error);
          sessionStorage.removeItem('pendingAction');
        }
      }
      
      // Properly check if user is authenticated before redirecting
      const isProperlyAuthenticated = user && session && sessionType && sessionType !== 'none' && isAuthenticated;
      
      // If authenticated and has return path, navigate there
      if (isProperlyAuthenticated && returnPath && location.pathname.includes('/login')) {
        console.log('Authenticated with return path, navigating to:', returnPath);
        sessionStorage.removeItem('returnPath');
        
        // Small delay to ensure auth state is fully updated
        setTimeout(() => {
          navigate(returnPath, { replace: true });
        }, 100);
      }
    }
  }, [isAuthenticated, isLoading, navigate, location, user, session, sessionType]);

  // Save current journey state before redirecting to login
  const saveJourneyAndRedirect = (action: PendingAction) => {
    console.log('Saving journey and redirecting to login:', action);
    sessionStorage.setItem('pendingAction', JSON.stringify(action));
    sessionStorage.setItem('returnPath', location.pathname);
    navigate('/user-login', { replace: false });
  };

  // Execute pending action after authentication
  const executePendingAction = () => {
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (!pendingActionStr) return null;
    
    try {
      const action = JSON.parse(pendingActionStr);
      console.log('Executing pending action:', action);
      
      // Clear the pending action immediately to prevent re-execution
      sessionStorage.removeItem('pendingAction');
      sessionStorage.removeItem('returnPath');
      setPendingAction(null);
      
      return action;
    } catch (error) {
      console.error('Error executing pending action:', error);
      sessionStorage.removeItem('pendingAction');
      sessionStorage.removeItem('returnPath');
      return null;
    }
  };

  return {
    pendingAction,
    saveJourneyAndRedirect,
    executePendingAction,
    hasPendingAction: !!pendingAction
  };
};
