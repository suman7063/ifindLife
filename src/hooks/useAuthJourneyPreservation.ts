
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

export type PendingAction = {
  type: 'favorite' | 'book' | 'call' | 'navigate' | string;
  id?: string | number;
  data?: {
    path?: string;
    [key: string]: any;
  };
};

export const useAuthJourneyPreservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
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
        } catch (error) {
          console.error('Error parsing pending action:', error);
          sessionStorage.removeItem('pendingAction');
        }
      }
      
      // If authenticated and has return path, navigate there
      if (isAuthenticated && returnPath && location.pathname.includes('/login')) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Save current journey state before redirecting to login
  const saveJourneyAndRedirect = (action: PendingAction) => {
    sessionStorage.setItem('pendingAction', JSON.stringify(action));
    sessionStorage.setItem('returnPath', location.pathname);
    navigate('/user-login', { replace: false });
  };

  // Execute pending action after authentication
  const executePendingAction = () => {
    if (!pendingAction) return false;
    
    // Logic to execute different types of actions
    const pendingActionData = pendingAction;
    
    // Clear the pending action
    sessionStorage.removeItem('pendingAction');
    setPendingAction(null);
    
    return pendingActionData;
  };

  return {
    pendingAction,
    saveJourneyAndRedirect,
    executePendingAction,
    hasPendingAction: !!pendingAction
  };
};
