
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SessionType, AuthSyncState } from './types';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/hooks/expert-auth';

export const useAuthCheckEffect = (
  currentUser: UserProfile | null,
  currentExpert: ExpertProfile | null,
  isAuthenticated: boolean,
  expertIsAuthenticated: boolean
) => {
  const [state, setState] = useState<AuthSyncState>({
    isUserAuthenticated: false,
    isExpertAuthenticated: false,
    isSynchronizing: true,
    isAuthInitialized: false,
    authCheckCompleted: false,
    hasDualSessions: false,
    sessionType: 'none',
    isLoggingOut: false
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthSync: Checking authentication status');
        setState(prev => ({ ...prev, isSynchronizing: true }));
        
        // Check for a Supabase session
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        if (!hasSession) {
          console.log('AuthSync: No session found');
          setState(prev => ({
            ...prev,
            isUserAuthenticated: false,
            isExpertAuthenticated: false,
            hasDualSessions: false,
            sessionType: 'none',
            isSynchronizing: false,
            isAuthInitialized: true,
            authCheckCompleted: true
          }));
        } else {
          console.log('AuthSync: Session found, checking user/expert status');
          // Check whether the session is for a user, expert, or both
          const hasUserProfile = !!currentUser;
          const hasExpertProfile = !!currentExpert;
          
          let sessionType: SessionType = 'none';
          let hasDualSessions = false;
          
          if (hasUserProfile && hasExpertProfile) {
            console.log('AuthSync: Dual profiles detected');
            hasDualSessions = true;
            sessionType = 'dual';
          } else if (hasUserProfile) {
            console.log('AuthSync: User profile detected');
            sessionType = 'user';
          } else if (hasExpertProfile) {
            console.log('AuthSync: Expert profile detected');
            sessionType = 'expert';
          } else {
            console.log('AuthSync: No profiles detected despite session');
            sessionType = 'none';
          }
          
          setState(prev => ({
            ...prev,
            isUserAuthenticated: isAuthenticated,
            isExpertAuthenticated: expertIsAuthenticated,
            hasDualSessions,
            sessionType,
            isSynchronizing: false,
            isAuthInitialized: true,
            authCheckCompleted: true
          }));
        }
      } catch (error) {
        console.error('Error in auth synchronization:', error);
        setState(prev => ({
          ...prev,
          isSynchronizing: false,
          isAuthInitialized: true,
          authCheckCompleted: true
        }));
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`AuthSync: Auth state changed: ${event}`);
      if (event === 'SIGNED_IN') {
        // Will be handled by the checkAuth function later
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...prev,
          isUserAuthenticated: false,
          isExpertAuthenticated: false,
          hasDualSessions: false,
          sessionType: 'none'
        }));
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
      if (!state.authCheckCompleted) {
        console.log('AuthSync: Auth check timeout reached, forcing completion');
        setState(prev => ({
          ...prev,
          isSynchronizing: false,
          isAuthInitialized: true,
          authCheckCompleted: true
        }));
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [state.authCheckCompleted]);
  
  return state;
};
