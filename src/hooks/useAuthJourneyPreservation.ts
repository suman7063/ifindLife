
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthRedirectSystem from '@/utils/authRedirectSystem';

export interface PendingAction {
  type: 'book' | 'call' | 'connect' | 'favorite' | 'navigate';
  id?: number;
  data?: Record<string, any>;
  path?: string;
}

export const useAuthJourneyPreservation = () => {
  const navigate = useNavigate();

  const saveJourneyAndRedirect = useCallback((action: PendingAction) => {
    console.log('useAuthJourneyPreservation: Saving journey and redirecting for action:', action);
    
    const currentPath = window.location.pathname + window.location.search;
    
    // Map legacy action format to new system
    let redirectAction: string;
    let redirectParams: Record<string, any> = {};
    
    switch (action.type) {
      case 'book':
        redirectAction = 'book';
        redirectParams = {
          expertId: action.id,
          expertName: action.data?.expertName || 'Expert',
          ...action.data
        };
        break;
      case 'call':
      case 'connect':
        redirectAction = action.data?.callType ? 'call' : 'connect';
        redirectParams = {
          expertId: action.id,
          expertName: action.data?.expertName || 'Expert',
          callType: action.data?.callType,
          ...action.data
        };
        break;
      case 'favorite':
        redirectAction = 'favorite';
        redirectParams = {
          expertId: action.id,
          expertName: action.data?.expertName || 'Expert',
          ...action.data
        };
        break;
      case 'navigate':
        redirectAction = 'navigate';
        redirectParams = action.data || {};
        break;
      default:
        redirectAction = action.type;
        redirectParams = action.data || {};
    }
    
    AuthRedirectSystem.setRedirect({
      returnTo: action.path || currentPath,
      action: redirectAction as any,
      params: redirectParams,
      message: `Please login to ${redirectAction} ${redirectParams.expertName || ''}`
    });
    
    navigate('/user-login');
  }, [navigate]);

  const executePendingAction = useCallback(() => {
    console.log('useAuthJourneyPreservation: Checking for pending actions');
    
    // Check new system first
    const pendingAction = AuthRedirectSystem.getPendingAction();
    if (pendingAction) {
      console.log('useAuthJourneyPreservation: Found pending action in new system:', pendingAction);
      return pendingAction;
    }

    // Check legacy system for backward compatibility
    const legacyActionStr = sessionStorage.getItem('pendingAction');
    if (legacyActionStr) {
      try {
        const legacyAction = JSON.parse(legacyActionStr);
        console.log('useAuthJourneyPreservation: Found legacy pending action:', legacyAction);
        sessionStorage.removeItem('pendingAction');
        return legacyAction;
      } catch (error) {
        console.error('Error parsing legacy pending action:', error);
        sessionStorage.removeItem('pendingAction');
      }
    }

    return null;
  }, []);

  return {
    saveJourneyAndRedirect,
    executePendingAction
  };
};

export default useAuthJourneyPreservation;
