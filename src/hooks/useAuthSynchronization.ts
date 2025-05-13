
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to provide a unified interface for authentication across user and expert roles
 */
export const useAuthSynchronization = () => {
  const auth = useAuth();
  const [initialized, setInitialized] = useState(false);
  
  // Set up derived state
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
    // Set user authentication state
    setIsAuthenticated(auth.isAuthenticated);
    setCurrentUser(auth.profile);
    setCurrentExpert(auth.expertProfile);
    
    // Determine specific authentication state
    setIsUserAuthenticated(auth.isAuthenticated && auth.role === 'user' && !!auth.profile);
    setIsExpertAuthenticated(auth.isAuthenticated && auth.role === 'expert' && !!auth.expertProfile);
    
    // Check for dual sessions
    setHasDualSessions(!!auth.profile && !!auth.expertProfile && auth.isAuthenticated);
    
    // Initialize session type
    if (!!auth.profile && !!auth.expertProfile) {
      setSessionType('dual');
    } else if (!!auth.profile) {
      setSessionType('user');
    } else if (!!auth.expertProfile) {
      setSessionType('expert');
    } else {
      setSessionType('none');
    }
    
    // Mark auth as initialized once loading is complete
    if (!auth.isLoading) {
      setIsAuthInitialized(true);
      setInitialized(true);
    }
  }, [auth.isAuthenticated, auth.role, auth.profile, auth.expertProfile, auth.isLoading]);
  
  // Handle user logout
  const userLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating user logout...");
      const result = await auth.logout();
      if (!result.error) {
        console.log("useAuthSynchronization: User logout successful");
        return true;
      } else {
        console.warn("useAuthSynchronization: User logout error:", result.error);
        return false;
      }
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
      const result = await auth.logout();
      if (!result.error) {
        console.log("useAuthSynchronization: Expert logout successful");
        return true;
      } else {
        console.warn("useAuthSynchronization: Expert logout error:", result.error);
        return false;
      }
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
      const result = await auth.logout();
      if (!result.error) {
        console.log("useAuthSynchronization: Full logout successful");
        return true;
      } else {
        console.warn("useAuthSynchronization: Full logout error:", result.error);
        return false;
      }
    } catch (error) {
      console.error('Full logout error:', error);
      toast.error('Error logging out');
      return false;
    }
  };

  return {
    // Auth state
    isAuthenticated,
    isUserAuthenticated,
    isExpertAuthenticated,
    currentUser,
    currentExpert,
    isAuthInitialized,
    hasDualSessions,
    sessionType,
    isLoading: auth.isLoading,
    
    // Auth actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
