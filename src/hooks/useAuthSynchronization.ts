
import { useState, useEffect, useCallback } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';

export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get user auth state from context
  const { 
    isAuthenticated, 
    currentUser, 
    authLoading: userAuthLoading, 
    logout: userLogoutFn
  } = useUserAuth();
  
  // Get expert auth state
  const { 
    expert, 
    loading: expertLoading, 
    authInitialized, 
    logout: expertLogoutFn 
  } = useExpertAuth();
  
  // Debug logging
  useEffect(() => {
    console.log('Auth Synchronization state:', {
      isAuthenticated,
      hasUserProfile: !!currentUser,
      hasSupabaseUser: isAuthenticated,
      userAuthLoading,
      isExpertAuthenticated: !!expert,
      hasExpertProfile: !!expert,
      expertLoading,
      expertAuthInitialized: authInitialized,
      isSynchronizing
    });
  }, [
    isAuthenticated, 
    currentUser, 
    expertLoading, 
    expert, 
    userAuthLoading, 
    authInitialized, 
    isSynchronizing
  ]);
  
  // Logout functions
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    
    try {
      console.log('Attempting user logout...');
      await userLogoutFn();
      toast.success('Successfully logged out');
      
      // Force page reload to clear all state
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('User logout error:', error);
      toast.error('Failed to log out. Please try again.');
      
      // Force page reload as failsafe
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      return false;
    } finally {
      setIsSynchronizing(false);
    }
  }, [userLogoutFn]);
  
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    
    try {
      console.log('Attempting expert logout...');
      const success = await expertLogoutFn();
      
      if (success) {
        toast.success('Successfully logged out as expert');
        
        // Force page reload to clear all state
        window.location.href = '/';
        return true;
      } else {
        toast.error('Failed to log out as expert. Please try again.');
        
        // Force page reload as failsafe
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        return false;
      }
    } catch (error) {
      console.error('Expert logout error:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force page reload as failsafe
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      return false;
    } finally {
      setIsSynchronizing(false);
    }
  }, [expertLogoutFn]);
  
  return {
    // User auth state
    isAuthenticated,
    currentUser,
    userAuthLoading,
    
    // Expert auth state
    isExpertAuthenticated: !!expert,
    expertProfile: expert,
    expertLoading,
    
    // Sync state
    isSynchronizing,
    isLoggingOut,
    setIsLoggingOut,
    
    // Actions
    userLogout,
    expertLogout
  };
};
