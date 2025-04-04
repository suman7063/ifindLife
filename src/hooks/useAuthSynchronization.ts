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
    currentExpert: expert, 
    isLoading: expertLoading, 
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
        
        if (!hasSession) {
          setSessionType('none');
          setHasDualSessions(false);
          return;
        }
        
        // Check if the current user has a profile in profiles table (regular user)
        const { data: userProfileData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        // Check if the current user has a profile in expert_accounts table
        const { data: expertProfileData, error: expertError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', data.session.user.id)
          .single();
        
        const hasUserProfile = !!userProfileData && !userError;
        const hasExpertProfile = !!expertProfileData && !expertError;
        
        console.log('Session check results:', {
          hasSession,
          hasUserProfile,
          hasExpertProfile,
          userId: data.session?.user.id
        });
        
        // Determine session type based on profile existence
        if (hasUserProfile && hasExpertProfile) {
          console.log('DUAL SESSION DETECTED - both user and expert profiles exist');
          setSessionType('dual');
          setHasDualSessions(true);
        } else if (hasUserProfile) {
          console.log('USER SESSION DETECTED - user profile exists');
          setSessionType('user');
          setHasDualSessions(false);
        } else if (hasExpertProfile) {
          console.log('EXPERT SESSION DETECTED - expert profile exists');
          setSessionType('expert');
          setHasDualSessions(false);
        } else {
          // Has session but no profiles - could be a new signup
          console.log('UNKNOWN SESSION TYPE - no profiles exist');
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
        // For dual sessions, we need a complete logout and reload
        return await fullLogout();
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
        // For dual sessions, we need a complete logout and reload
        return await fullLogout();
      }
      
      // Standard expert logout
      console.log('Attempting expert logout...');
      const success = await expertLogoutFn();
      
      // Check boolean return value properly
      if (success === true) {
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
