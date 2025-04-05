
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from './useUserAuth';
import { useExpertAuth } from './useExpertAuth';
import { logEvent } from '@/lib/analytics';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from './expert-auth/types';
import { toast } from 'sonner';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export const useAuthSynchronization = () => {
  const { 
    isAuthenticated: isUserAuthenticated, 
    currentUser, 
    loading: userLoading,
    logout: userLogout
  } = useUserAuth();
  
  const { 
    isAuthenticated: isExpertAuthenticated, 
    currentExpert, 
    isLoading: expertLoading,
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
  const isAuthLoading = userLoading || expertLoading;
  const isSynchronizing = false;
  const authCheckCompleted = isAuthInitialized && !isAuthLoading;
  const expertProfile = currentExpert;

  // Synchronize experts with user profiles and vice versa
  useEffect(() => {
    if (isUserAuthenticated && isExpertAuthenticated) {
      logEvent('auth', 'dual_login_detected', { 
        user_id: currentUser?.id,
        expert_id: currentExpert?.id 
      });
      
      // Show warning to user about dual sessions
      toast.warning('You are logged in as both user and expert. This may cause issues.');
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
        toast.success('Successfully logged out of all accounts');
      }
      
      return success;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('Error occurred during logout');
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
    userLoading,
    expertLoading,
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
