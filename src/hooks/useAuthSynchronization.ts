
import { useState, useEffect, useCallback, useRef } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook to synchronize and manage authentication states between user and expert systems
 */
export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');
  const authCheckCompleted = useRef(false);
  
  // Get user auth state from context
  const { 
    isAuthenticated: userIsAuthenticated, 
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
      isAuthenticated: userIsAuthenticated,
      hasUserProfile: !!currentUser,
      hasSupabaseUser: !!supabaseUser,
      userAuthLoading,
      isExpertAuthenticated: !!expert,
      hasExpertProfile: !!expert,
      expertLoading,
      expertAuthInitialized: authInitialized,
      isSynchronizing,
      authCheckCompleted: authCheckCompleted.current,
      hasDualSessions,
      sessionType
    });
  }, [
    userIsAuthenticated, 
    currentUser,
    supabaseUser,
    expertLoading, 
    expert, 
    userAuthLoading, 
    authInitialized, 
    isSynchronizing,
    hasDualSessions,
    sessionType
  ]);

  // Set the session type based on what auth contexts are active
  useEffect(() => {
    const checkSessionType = async () => {
      if (!authCheckCompleted.current || userAuthLoading || expertLoading) {
        return;
      }
      
      try {
        // Get current session directly from Supabase
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        // Most reliable check is having actual profiles, not just auth states
        if (currentUser && expert && hasSession) {
          setSessionType('dual');
          setHasDualSessions(true);
        } else if (currentUser && hasSession) {
          setSessionType('user');
          setHasDualSessions(false);
        } else if (expert && hasSession) {
          setSessionType('expert');
          setHasDualSessions(false);
        } else {
          setSessionType('none');
          setHasDualSessions(false);
        }
      } catch (error) {
        console.error('Error checking session type:', error);
        // Default to what we know from the contexts if direct check fails
        if (userIsAuthenticated && currentUser && expert) {
          setSessionType('dual');
          setHasDualSessions(true);
        } else if (userIsAuthenticated && currentUser) {
          setSessionType('user');
          setHasDualSessions(false);
        } else if (expert) {
          setSessionType('expert');
          setHasDualSessions(false);
        } else {
          setSessionType('none');
          setHasDualSessions(false);
        }
      }
    };
    
    checkSessionType();
  }, [userIsAuthenticated, currentUser, expert, userAuthLoading, expertLoading, authCheckCompleted]);

  // Mark auth check as completed when all loading states resolve
  useEffect(() => {
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
      setSessionType('none');
      authCheckCompleted.current = false;
      
      toast.success('Successfully logged out of all accounts');
      
      // Force page reload to clear all state
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Full logout error:', error);
      toast.error('Failed to log out completely. Please try again.');
      
      // Force page reload as failsafe
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return false;
    } finally {
      setIsSynchronizing(false);
      setIsLoggingOut(false);
    }
  }, []);
  
  // User-specific logout function
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      // If we have dual sessions, handle differently
      if (hasDualSessions) {
        console.log('Dual sessions detected during user logout, preserving expert session...');
        
        try {
          // Use localStorage to preserve expert session info
          const storageKeys = Object.keys(localStorage);
          let expertSessionData = {};
          
          storageKeys.forEach(key => {
            if (key.startsWith('sb-')) {
              expertSessionData[key] = localStorage.getItem(key);
            }
          });
          
          // Perform user context logout
          await userLogoutFn();
          
          // Need a slight delay before continuing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // The expert session should now be the active one
          console.log('User session cleared, expert session should remain active');
          setSessionType('expert');
          setHasDualSessions(false);
          
          toast.success('Successfully logged out as user');
          authCheckCompleted.current = false;
          
          return true;
        } catch (error) {
          console.error('Error during selective logout in dual session:', error);
          // Fall back to full logout as a failsafe
          return await fullLogout();
        }
      }
      
      // Standard user logout
      console.log('Attempting user logout...');
      await userLogoutFn();
      
      // Reset auth check completed flag
      authCheckCompleted.current = false;
      setSessionType('none');
      
      toast.success('Successfully logged out');
      
      // No need to force page reload here - auth state change handlers
      // will update the UI appropriately
      return true;
    } catch (error) {
      console.error('User logout error:', error);
      toast.error('Failed to log out. Please try again.');
      
      // Force page reload as failsafe
      window.location.reload();
      return false;
    } finally {
      setIsSynchronizing(false);
      setIsLoggingOut(false);
    }
  }, [userLogoutFn, hasDualSessions, fullLogout]);
  
  // Expert-specific logout function
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsSynchronizing(true);
    setIsLoggingOut(true);
    
    try {
      // If we have dual sessions, handle differently
      if (hasDualSessions) {
        console.log('Dual sessions detected during expert logout, preserving user session...');
        
        try {
          // Use localStorage to preserve user session info
          const storageKeys = Object.keys(localStorage);
          let userSessionData = {};
          
          storageKeys.forEach(key => {
            if (key.startsWith('sb-')) {
              userSessionData[key] = localStorage.getItem(key);
            }
          });
          
          // Perform expert context logout
          await expertLogoutFn();
          
          // Need a slight delay before continuing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // The user session should now be the active one
          console.log('Expert session cleared, user session should remain active');
          setSessionType('user');
          setHasDualSessions(false);
          
          toast.success('Successfully logged out as expert');
          authCheckCompleted.current = false;
          
          return true;
        } catch (error) {
          console.error('Error during selective logout in dual session:', error);
          // Fall back to full logout as a failsafe
          return await fullLogout();
        }
      }
      
      // Standard expert logout
      console.log('Attempting expert logout...');
      const success = await expertLogoutFn();
      
      // Reset auth check completed flag
      authCheckCompleted.current = false;
      setSessionType('none');
      
      if (success) {
        toast.success('Successfully logged out as expert');
        return true;
      } else {
        toast.error('Failed to log out as expert. Please try again.');
        
        // Force page reload as failsafe
        window.location.reload();
        return false;
      }
    } catch (error) {
      console.error('Expert logout error:', error);
      toast.error('Failed to log out as expert. Please try again.');
      
      // Force page reload as failsafe
      window.location.reload();
      return false;
    } finally {
      setIsSynchronizing(false);
      setIsLoggingOut(false);
    }
  }, [expertLogoutFn, hasDualSessions, fullLogout]);
  
  return {
    // User auth state
    isAuthenticated: userIsAuthenticated,
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
    sessionType,
    
    // Auth check status
    authCheckCompleted: authCheckCompleted.current,
    
    // Actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
