import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from './useSimpleAuth';
import { toast } from 'sonner';

export const useAuthRedirectSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSimpleAuth();

  const setIntendedAction = useCallback((action: {
    type: 'book' | 'call' | 'connect';
    expertId: string;
    expertName: string;
    path?: string;
  }) => {
    // Store the intended action in sessionStorage
    sessionStorage.setItem('pendingAction', JSON.stringify({
      ...action,
      timestamp: Date.now(),
      currentPath: location.pathname + location.search
    }));
    console.log('Stored pending action:', action);
  }, [location]);

  const clearIntendedAction = useCallback(() => {
    sessionStorage.removeItem('pendingAction');
    console.log('Cleared pending action');
  }, []);

  const requireAuthForExpert = useCallback((expertId: string, expertName: string, actionType: 'book' | 'connect') => {
    if (isAuthenticated) {
      clearIntendedAction();
      return true;
    }

    // Store the intended action
    setIntendedAction({
      type: actionType,
      expertId,
      expertName
    });

    // Show message and redirect to login
    toast.info(`Please log in to ${actionType} with ${expertName}`);
    navigate('/user-login', { 
      state: { 
        from: { pathname: location.pathname },
        expertAction: { type: actionType, expertId, expertName }
      }
    });
    return false;
  }, [isAuthenticated, setIntendedAction, clearIntendedAction, navigate, location]);

  const requireAuthForCall = useCallback((expertId: string, expertName: string, callType: 'video' | 'voice') => {
    if (isAuthenticated) {
      clearIntendedAction();
      return true;
    }

    // Store the intended action
    setIntendedAction({
      type: 'call',
      expertId,
      expertName,
      path: `${location.pathname}?call=${callType}`
    });

    // Show message and redirect to login
    toast.info(`Please log in to start a ${callType} call with ${expertName}`);
    navigate('/user-login', { 
      state: { 
        from: { pathname: location.pathname },
        expertAction: { type: 'call', expertId, expertName, callType }
      }
    });
    return false;
  }, [isAuthenticated, setIntendedAction, clearIntendedAction, navigate, location]);

  const executeIntendedAction = useCallback(() => {
    const pendingActionStr = sessionStorage.getItem('pendingAction');
    if (!pendingActionStr) return null;

    try {
      const pendingAction = JSON.parse(pendingActionStr);
      console.log('Executing intended action:', pendingAction);
      
      // Clear the action first
      clearIntendedAction();
      
      // Check if action is not too old (30 minutes)
      const maxAge = 30 * 60 * 1000; // 30 minutes
      if (Date.now() - pendingAction.timestamp > maxAge) {
        console.log('Pending action expired');
        return null;
      }

      return pendingAction;
    } catch (error) {
      console.error('Error parsing pending action:', error);
      clearIntendedAction();
      return null;
    }
  }, [clearIntendedAction]);

  return {
    isAuthenticated,
    requireAuthForExpert,
    requireAuthForCall,
    executeIntendedAction,
    setIntendedAction,
    clearIntendedAction
  };
};