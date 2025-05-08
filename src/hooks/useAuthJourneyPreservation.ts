
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export interface PendingAction {
  type: string;
  id: string;
  path: string;
  scrollPosition: number;
}

export const useAuthJourneyPreservation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check for and execute pending actions when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const pendingActionStr = sessionStorage.getItem('pendingAction');
      if (pendingActionStr) {
        try {
          const pendingAction: PendingAction = JSON.parse(pendingActionStr);
          console.log("AuthJourneyPreservation - Found pending action:", pendingAction);
          
          // Clear the pending action to prevent repeated processing
          sessionStorage.removeItem('pendingAction');
          
          // Navigate to the stored path if different from current
          if (pendingAction.path && window.location.pathname !== pendingAction.path) {
            console.log("AuthJourneyPreservation - Navigating to stored path:", pendingAction.path);
            navigate(pendingAction.path);
          }
          
          // Use setTimeout to ensure navigation is complete before executing other actions
          setTimeout(() => {
            // Restore scroll position
            window.scrollTo(0, pendingAction.scrollPosition);
            
            // Execute the stored action based on type
            executeStoredAction(pendingAction);
          }, 500);
        } catch (error) {
          console.error('Error processing pending action:', error);
          sessionStorage.removeItem('pendingAction');
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const executeStoredAction = (action: PendingAction) => {
    switch (action.type) {
      case 'favorite':
        // The favorite action will be handled in the component after navigation
        toast.info('Now you can add this to your favorites!');
        break;
      case 'call':
        // Handle call action
        setTimeout(() => {
          navigate(`/experts/${action.id}?call=true`);
        }, 100);
        break;
      case 'book':
        // Handle booking action
        setTimeout(() => {
          navigate(`/experts/${action.id}?book=true`);
        }, 100);
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };
  
  // Function to store a pending action
  const storePendingAction = (actionType: string, itemId: string, path = window.location.pathname) => {
    const pendingAction: PendingAction = {
      type: actionType,
      id: itemId,
      path: path,
      scrollPosition: window.scrollY
    };
    sessionStorage.setItem('pendingAction', JSON.stringify(pendingAction));
  };
  
  return {
    storePendingAction
  };
};

export default useAuthJourneyPreservation;
