
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from './useUserAuth';
import { useExpertAuth } from './expert-auth';
import { logEvent } from '@/lib/analytics';

export const useAuthSynchronization = () => {
  const { 
    isAuthenticated: isUserAuthenticated, 
    currentUser, 
    isLoading: userIsLoading 
  } = useUserAuth();
  
  const { 
    isAuthenticated: isExpertAuthenticated, 
    currentExpert, 
    isLoading: expertIsLoading,
    authInitialized: expertAuthInitialized
  } = useExpertAuth();
  
  const navigate = useNavigate();

  // Synchronize experts with user profiles and vice versa
  useEffect(() => {
    if (isUserAuthenticated && isExpertAuthenticated) {
      logEvent('auth', 'dual_login_detected', { 
        user_id: currentUser?.id,
        expert_id: currentExpert?.id 
      });
    }
  }, [isUserAuthenticated, isExpertAuthenticated, currentUser, currentExpert]);

  return {
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    isUserLoading: userIsLoading,
    isExpertLoading: expertIsLoading,
    expertAuthInitialized
  };
};
