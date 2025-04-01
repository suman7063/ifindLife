
import { useState, useEffect, useCallback, useRef } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
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
      authCheckCompleted: authCheckCompleted.current,
      hasDualSessions
    });
  }, [
    isAuthenticated, 
    currentUser,
    supabaseUser,
    expertLoading, 
    expert, 
    userAuthLoading, 
    authInitialized, 
    isSynchronizing,
    hasDualSessions
  ]);

  // Check for dual-sessions (both user and expert simultaneously)
  useEffect(() => {
    if (authCheckCompleted.current && !userAuthLoading && !expertLoading) {
      // If both authentications are active, set dual sessions flag
      if (isAuthenticated && currentUser && expert) {
        console.log('Detected dual sessions: User is logged in as both user and expert');
        setHasDualSessions(true);
      } else {
        setHasDualSessions(false);
      }
    }
  }, [isAuthenticated, currentUser, expert, userAuthLoading, expertLoading]);

  useEffect(() => {
    // Mark auth check as completed when all loading states resolve
    if (!userAuthLoading && !expertLoading && authInitialized) {
      authCheckCompleted.current = true;
    }
  }, [userAuthLoading, expertLoading, authInitialized]);
  
  // Full logout function - to guarantee we log out of all sessions
  const fullLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      console.log('Performing full logout of all sessions...');
      
      // First sign out from Supabase completely
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local session data
      try {
        const storageKeys = Object.keys(localStorage);
        const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
        
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Error cleaning up local storage:', e);
      }
      
      // Reset states
      setHasDualSessions(false);
      authCheckCompleted.current = false;
      
      toast.success('Successfully logged out of all accounts');
      
      // Force page reload to clear all state
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('Full logout error:', error);
      toast.error('Failed to log out completely. Please try again.');
      
      // Force page reload as failsafe
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      return false;
    } finally {
      setIsSynchronizing(false);
      setIsLoggingOut(false);
    }
  }, []);
  
  // Logout functions
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      // If we have dual sessions, do a full logout
      if (hasDualSessions) {
        console.log('Dual sessions detected, performing full logout...');
        return await fullLogout();
      }
      
      console.log('Attempting user logout...');
      await userLogoutFn();
      
      // Ensure we fully sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local session data
      try {
        const storageKeys = Object.keys(localStorage);
        const supabaseKeys = storageKeys.filter(key => key.startsWith('sb-'));
        
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Error cleaning up local storage:', e);
      }
      
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
  }, [userLogoutFn, hasDualSessions, fullLogout]);
  
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      // If we have dual sessions, do a full logout
      if (hasDualSessions) {
        console.log('Dual sessions detected, performing full logout...');
        return await fullLogout();
      }
      
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
  }, [expertLogoutFn, hasDualSessions, fullLogout]);
  
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
    hasDualSessions,
    
    // Auth check status
    authCheckCompleted: authCheckCompleted.current,
    
    // Actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
