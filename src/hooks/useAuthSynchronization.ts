
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUserAuth } from '@/contexts/auth/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';

export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isExpertAuthenticated, setIsExpertAuthenticated] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
  const [sessionType, setSessionType] = useState<'user' | 'expert' | 'dual' | 'none'>('none');
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  
  const { currentUser, isAuthenticated, logout } = useUserAuth();
  const { currentExpert, isAuthenticated: expertIsAuthenticated, logout: expertLogout } = useExpertAuth();
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthSync: Checking authentication status');
        setIsSynchronizing(true);
        
        // Check for a Supabase session
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        if (!hasSession) {
          console.log('AuthSync: No session found');
          setIsUserAuthenticated(false);
          setIsExpertAuthenticated(false);
          setHasDualSessions(false);
          setSessionType('none');
        } else {
          console.log('AuthSync: Session found, checking user/expert status');
          // Check whether the session is for a user, expert, or both
          const hasUserProfile = !!currentUser;
          const hasExpertProfile = !!currentExpert;
          
          setIsUserAuthenticated(isAuthenticated);
          setIsExpertAuthenticated(expertIsAuthenticated);
          
          // Detect conflicting sessions
          if (hasUserProfile && hasExpertProfile) {
            console.log('AuthSync: Dual profiles detected');
            setHasDualSessions(true);
            setSessionType('dual');
          } else if (hasUserProfile) {
            console.log('AuthSync: User profile detected');
            setHasDualSessions(false);
            setSessionType('user');
          } else if (hasExpertProfile) {
            console.log('AuthSync: Expert profile detected');
            setHasDualSessions(false);
            setSessionType('expert');
          } else {
            console.log('AuthSync: No profiles detected despite session');
            setHasDualSessions(false);
            setSessionType('none');
          }
        }
      } catch (error) {
        console.error('Error in auth synchronization:', error);
      } finally {
        setIsSynchronizing(false);
        setIsAuthInitialized(true);
        setAuthCheckCompleted(true);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`AuthSync: Auth state changed: ${event}`);
      if (event === 'SIGNED_IN') {
        // Will be handled by the checkAuth function later
      } else if (event === 'SIGNED_OUT') {
        setIsUserAuthenticated(false);
        setIsExpertAuthenticated(false);
        setHasDualSessions(false);
        setSessionType('none');
      }
      
      // Re-run the auth check after an auth state change
      checkAuth();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, currentExpert, isAuthenticated, expertIsAuthenticated]);
  
  // Add a timeout to ensure auth check completes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!authCheckCompleted) {
        console.log('AuthSync: Auth check timeout reached, forcing completion');
        setIsSynchronizing(false);
        setIsAuthInitialized(true);
        setAuthCheckCompleted(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [authCheckCompleted]);
  
  // User logout function
  const userLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting user logout');
      const success = await logout();
      
      if (success) {
        setIsUserAuthenticated(false);
        if (sessionType === 'dual') {
          setSessionType('expert');
        } else {
          setSessionType('none');
        }
        setHasDualSessions(false);
        toast.success('Successfully logged out as user');
      } else {
        toast.error('Failed to log out as user');
      }
      
      return success;
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, sessionType]);
  
  // Expert logout function
  const expertLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting expert logout');
      const success = await expertLogout();
      
      if (success) {
        setIsExpertAuthenticated(false);
        if (sessionType === 'dual') {
          setSessionType('user');
        } else {
          setSessionType('none');
        }
        setHasDualSessions(false);
        toast.success('Successfully logged out as expert');
      } else {
        toast.error('Failed to log out as expert');
      }
      
      return success;
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [expertLogout, sessionType]);
  
  // Full logout function (both user and expert)
  const fullLogout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    
    try {
      console.log('AuthSync: Starting full logout');
      
      // Sign out from Supabase completely
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Error during full logout:', error);
        toast.error('Failed to log out: ' + error.message);
        return false;
      }
      
      // Clear any local storage related to authentication
      localStorage.removeItem('expertProfile');
      
      // Update state
      setIsUserAuthenticated(false);
      setIsExpertAuthenticated(false);
      setHasDualSessions(false);
      setSessionType('none');
      
      toast.success('Successfully logged out of all accounts');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error during full logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, []);
  
  return {
    isUserAuthenticated,
    isExpertAuthenticated,
    isSynchronizing,
    isAuthInitialized,
    authCheckCompleted,
    hasDualSessions,
    sessionType,
    isAuthenticated: isUserAuthenticated,
    isExpertAuthenticated,
    isAuthLoading: isSynchronizing,
    isLoggingOut,
    setIsLoggingOut,
    userLogout,
    expertLogout,
    fullLogout
  };
};
