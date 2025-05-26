
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

/**
 * Hook to provide a unified interface for authentication across user and expert roles
 */
export const useAuthSynchronization = () => {
  const auth = useAuth();
  
  // Set up derived state with proper boolean defaults
  const [authState, setAuthState] = useState({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isUserAuthenticated: false,
    isExpertAuthenticated: false,
    currentUser: null,
    currentExpert: null,
    isAuthInitialized: false,
    hasDualSessions: false,
    sessionType: 'none' as 'none' | 'user' | 'expert' | 'dual'
  });
  
  // Set up auth state change listener for real-time updates
  useEffect(() => {
    console.log('useAuthSynchronization: Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuthSynchronization: Auth state changed:', { event, session: !!session });
        
        const newState = {
          user: session?.user || null,
          session: session,
          loading: false,
          isAuthenticated: Boolean(session?.user),
          isUserAuthenticated: Boolean(session?.user && auth.role === 'user'),
          isExpertAuthenticated: Boolean(session?.user && auth.role === 'expert'),
          currentUser: auth.userProfile || null,
          currentExpert: auth.expertProfile || null,
          isAuthInitialized: true,
          hasDualSessions: Boolean(auth.userProfile && auth.expertProfile),
          sessionType: auth.sessionType || 'none'
        };
        
        console.log('useAuthSynchronization: Updated auth state:', newState);
        setAuthState(newState);
      }
    );
    
    return () => {
      console.log('useAuthSynchronization: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // Initialize state based on auth context
  useEffect(() => {
    console.log('useAuthSynchronization: Processing auth context state:', {
      authIsAuthenticated: auth.isAuthenticated,
      authRole: auth.role,
      userProfile: !!auth.userProfile,
      expertProfile: !!auth.expertProfile,
      isLoading: auth.isLoading
    });

    // Convert auth.isAuthenticated to proper boolean
    const authIsAuthenticated = Boolean(auth.isAuthenticated);
    const hasUserProfile = Boolean(auth.userProfile);
    const hasExpertProfile = Boolean(auth.expertProfile);
    
    const newState = {
      user: auth.user || null,
      session: auth.session || null,
      loading: auth.isLoading,
      isAuthenticated: authIsAuthenticated,
      isUserAuthenticated: authIsAuthenticated && auth.role === 'user' && hasUserProfile,
      isExpertAuthenticated: authIsAuthenticated && auth.role === 'expert' && hasExpertProfile,
      currentUser: auth.userProfile || null,
      currentExpert: auth.expertProfile || null,
      isAuthInitialized: !auth.isLoading,
      hasDualSessions: hasUserProfile && hasExpertProfile && authIsAuthenticated,
      sessionType: auth.sessionType || (hasUserProfile && hasExpertProfile ? 'dual' : hasUserProfile ? 'user' : hasExpertProfile ? 'expert' : 'none')
    };

    console.log('useAuthSynchronization: Setting state from auth context:', newState);
    setAuthState(newState);
  }, [auth.isAuthenticated, auth.role, auth.userProfile, auth.expertProfile, auth.isLoading, auth.sessionType, auth.user, auth.session]);
  
  // Handle user logout
  const userLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating user logout...");
      const success = await auth.logout();
      if (success) {
        console.log("useAuthSynchronization: User logout successful");
      } else {
        console.warn("useAuthSynchronization: User logout returned false");
      }
      return Boolean(success);
    } catch (error) {
      console.error('useAuthSynchronization: User logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };
  
  // Handle expert logout
  const expertLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating expert logout...");
      const success = await auth.logout();
      if (success) {
        console.log("useAuthSynchronization: Expert logout successful");
      } else {
        console.warn("useAuthSynchronization: Expert logout returned false");
      }
      return Boolean(success);
    } catch (error) {
      console.error('useAuthSynchronization: Expert logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };
  
  // Handle full logout - both user and expert
  const fullLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating full logout...");
      const success = await auth.logout();
      if (success) {
        console.log("useAuthSynchronization: Full logout successful");
      } else {
        console.warn("useAuthSynchronization: Full logout returned false");
      }
      return Boolean(success);
    } catch (error) {
      console.error('useAuthSynchronization: Full logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };

  return {
    // Auth state - all properly converted to booleans
    ...authState,
    
    // Auth actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
