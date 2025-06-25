
import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import AuthRedirectSystem from '@/utils/authRedirectSystem';
import { toast } from 'sonner';

export const useAuthRedirectSystem = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Execute post-login redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const executeRedirect = async () => {
        // Small delay to ensure auth state is fully stabilized
        setTimeout(async () => {
          const redirectExecuted = await AuthRedirectSystem.executeRedirect();
          
          if (!redirectExecuted) {
            // Check for pending actions from URL parameters or other sources
            const urlParams = new URLSearchParams(location.search);
            const action = urlParams.get('action');
            const expertId = urlParams.get('expertId');
            
            if (action && expertId) {
              console.log('useAuthRedirectSystem: Found URL-based action to execute');
              // Handle URL-based actions if needed
            }
          }
        }, 500);
      };
      
      executeRedirect();
    }
  }, [isAuthenticated, user, location]);

  // Set redirect for authentication required actions
  const requireAuth = useCallback((
    action: string,
    params?: Record<string, any>,
    message?: string
  ) => {
    if (isAuthenticated) {
      return true; // User is already authenticated
    }

    const currentPath = window.location.pathname + window.location.search;
    
    AuthRedirectSystem.setRedirect({
      returnTo: currentPath,
      action: action as any,
      params,
      message: message || `Please login to ${action}`
    });

    // Navigate to login
    navigate('/user-login');
    return false;
  }, [isAuthenticated, navigate]);

  // Convenience methods for common actions
  const requireAuthForExpert = useCallback((
    expertId: number,
    expertName: string,
    action: 'favorite' | 'connect' | 'book' | 'call',
    additionalParams?: Record<string, any>
  ) => {
    if (isAuthenticated) {
      return true;
    }

    AuthRedirectSystem.setExpertAction(expertId, expertName, action, additionalParams);
    navigate('/user-login');
    return false;
  }, [isAuthenticated, navigate]);

  const requireAuthForCall = useCallback((
    expertId: number,
    expertName: string,
    callType: 'video' | 'voice'
  ) => {
    if (isAuthenticated) {
      return true;
    }

    AuthRedirectSystem.setCallAction(expertId, expertName, callType);
    navigate('/user-login');
    return false;
  }, [isAuthenticated, navigate]);

  // Execute pending actions on current page
  const executePendingAction = useCallback(() => {
    const pendingAction = AuthRedirectSystem.getPendingAction();
    
    if (pendingAction) {
      console.log('useAuthRedirectSystem: Executing pending action:', pendingAction);
      
      // Return the action for the component to handle
      return pendingAction;
    }
    
    return null;
  }, []);

  return {
    requireAuth,
    requireAuthForExpert,
    requireAuthForCall,
    executePendingAction,
    isAuthenticated
  };
};
