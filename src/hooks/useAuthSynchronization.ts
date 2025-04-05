
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from './useUserAuth';
import { useExpertAuth } from './expert-auth';
import { logEvent } from '@/lib/analytics';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from './expert-auth/types';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export const useAuthSynchronization = () => {
  const { 
    isAuthenticated: isUserAuthenticated, 
    currentUser, 
    loading: userIsLoading,
    logout: userLogout
  } = useUserAuth();
  
  const { 
    isAuthenticated: isExpertAuthenticated, 
    currentExpert, 
    isLoading: expertIsLoading,
    authInitialized: expertAuthInitialized,
    logout: expertLogout
  } = useExpertAuth();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Calculate if we have dual sessions
  const hasDualSessions = isUserAuthenticated && isExpertAuthenticated;
  
  // Determine current session type
  const sessionType: SessionType = hasDualSessions 
    ? 'dual'
    : isUserAuthenticated 
      ? 'user' 
      : isExpertAuthenticated 
        ? 'expert' 
        : 'none';
        
  // For backward compatibility
  const isAuthenticated = isUserAuthenticated || isExpertAuthenticated;
  
  // Combined auth state properties
  const isAuthInitialized = expertAuthInitialized;
  const isAuthLoading = userIsLoading || expertIsLoading;
  const isSynchronizing = false; // Added for compatibility
  const authCheckCompleted = isAuthInitialized && !isAuthLoading; // Added for compatibility
  const expertProfile = currentExpert; // Alias for compatibility

  // Synchronize experts with user profiles and vice versa
  useEffect(() => {
    if (isUserAuthenticated && isExpertAuthenticated) {
      logEvent('auth', 'dual_login_detected', { 
        user_id: currentUser?.id,
        expert_id: currentExpert?.id 
      });
    }
  }, [isUserAuthenticated, isExpertAuthenticated, currentUser, currentExpert]);

  // Function to log out of both accounts
  const fullLogout = async (): Promise<boolean> => {
    setIsLoggingOut(true);
    try {
      let userSuccess = true;
      let expertSuccess = true;
      
      if (isUserAuthenticated) {
        userSuccess = await userLogout();
      }
      
      if (isExpertAuthenticated) {
        expertSuccess = await expertLogout();
      }
      
      const success = userSuccess && expertSuccess;
      
      if (success) {
        navigate('/');
      }
      
      return success;
    } catch (error) {
      console.error('Error during full logout:', error);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Function to log out current user (for compatibility)
  const logout = async (): Promise<boolean> => {
    if (isUserAuthenticated) {
      return await userLogout();
    } else if (isExpertAuthenticated) {
      return await expertLogout();
    }
    return true;
  };

  return {
    // Original properties
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    isUserLoading: userIsLoading,
    isExpertLoading: expertIsLoading,
    expertAuthInitialized,
    
    // Computed properties
    hasDualSessions,
    sessionType,
    
    // Backwards compatibility aliases
    isAuthenticated,
    expertProfile,
    isAuthInitialized,
    isAuthLoading,
    isSynchronizing,
    authCheckCompleted,
    userAuthLoading: userIsLoading,
    
    // Actions
    userLogout,
    expertLogout,
    fullLogout,
    logout,
    
    // State
    isLoggingOut,
    setIsLoggingOut
  };
};
