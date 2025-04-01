
import { useState, useEffect, useCallback, useRef } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const authCheckCompleted = useRef(false);
  
  // Get user auth state from context
  const { 
    isAuthenticated, 
    currentUser, 
    authLoading: userAuthLoading, 
    logout: userLogoutFn,
    user: supabaseUser
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
      hasSupabaseUser: !!supabaseUser,
      userAuthLoading,
      isExpertAuthenticated: !!expert,
      hasExpertProfile: !!expert,
      expertLoading,
      expertAuthInitialized: authInitialized,
      isSynchronizing,
      authCheckCompleted: authCheckCompleted.current
    });
  }, [
    isAuthenticated, 
    currentUser,
    supabaseUser,
    expertLoading, 
    expert, 
    userAuthLoading, 
    authInitialized, 
    isSynchronizing
  ]);

  useEffect(() => {
    // Mark auth check as completed when all loading states resolve
    if (!userAuthLoading && !expertLoading && authInitialized) {
      authCheckCompleted.current = true;
    }
  }, [userAuthLoading, expertLoading, authInitialized]);
  
  // Logout functions
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting user logout...');
      await userLogoutFn();
      
      // Ensure we fully sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset auth check completed flag
      authCheckCompleted.current = false;
      
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
      setIsLoggingOut(false);
    }
  }, [userLogoutFn]);
  
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      console.log('Attempting expert logout...');
      const success = await expertLogoutFn();
      
      // Reset auth check completed flag
      authCheckCompleted.current = false;
      
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
      setIsLoggingOut(false);
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
    
    // Auth check status
    authCheckCompleted: authCheckCompleted.current,
    
    // Actions
    userLogout,
    expertLogout
  };
};
