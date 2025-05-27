
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to provide a unified interface for authentication across user and expert roles
 */
export const useAuthSynchronization = () => {
  const auth = useAuth();
  const [initialized, setInitialized] = useState(false);
  
  // Set up derived state with proper boolean defaults
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isExpertAuthenticated, setIsExpertAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentExpert, setCurrentExpert] = useState<any>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
  const [sessionType, setSessionType] = useState<'none' | 'user' | 'expert' | 'dual'>('none');
  
  // Initialize all state based on auth context
  useEffect(() => {
    console.log('useAuthSynchronization: Processing auth state:', {
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
    
    // Set user authentication state
    setIsAuthenticated(authIsAuthenticated);
    setCurrentUser(auth.userProfile || null);
    setCurrentExpert(auth.expertProfile || null);
    
    // Determine specific authentication state
    setIsUserAuthenticated(authIsAuthenticated && auth.role === 'user' && hasUserProfile);
    setIsExpertAuthenticated(authIsAuthenticated && auth.role === 'expert' && hasExpertProfile);
    
    // Check for dual sessions
    setHasDualSessions(hasUserProfile && hasExpertProfile && authIsAuthenticated);
    
    // Initialize session type from auth context
    if (auth.sessionType && auth.sessionType !== 'none') {
      setSessionType(auth.sessionType);
    } else {
      // Fallback determination of session type
      if (hasUserProfile && hasExpertProfile) {
        setSessionType('dual');
      } else if (hasUserProfile && auth.role === 'user') {
        setSessionType('user');
      } else if (hasExpertProfile && auth.role === 'expert') {
        setSessionType('expert');
      } else {
        setSessionType('none');
      }
    }
    
    // Mark auth as initialized once loading is complete
    if (!auth.isLoading) {
      setIsAuthInitialized(true);
      setInitialized(true);
    }

    console.log('useAuthSynchronization: Updated state:', {
      isAuthenticated: authIsAuthenticated,
      isUserAuthenticated: authIsAuthenticated && auth.role === 'user' && hasUserProfile,
      isExpertAuthenticated: authIsAuthenticated && auth.role === 'expert' && hasExpertProfile,
      sessionType: auth.sessionType || 'none'
    });
  }, [auth.isAuthenticated, auth.role, auth.userProfile, auth.expertProfile, auth.isLoading, auth.sessionType]);
  
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
      return Boolean(success); // Ensure boolean return
    } catch (error) {
      console.error('User logout error:', error);
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
      return Boolean(success); // Ensure boolean return
    } catch (error) {
      console.error('Expert logout error:', error);
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
      return Boolean(success); // Ensure boolean return
    } catch (error) {
      console.error('Full logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };

  return {
    // Auth state - all properly converted to booleans
    isAuthenticated,
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    isAuthInitialized,
    hasDualSessions,
    sessionType,
    isLoading: Boolean(auth.isLoading),
    
    // Auth actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
