
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook to provide a unified interface for authentication across user and expert roles
 */
export const useAuthSynchronization = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  // Set up derived state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isExpertAuthenticated, setIsExpertAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentExpert, setCurrentExpert] = useState<any>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
  const [sessionType, setSessionType] = useState<'user' | 'expert' | 'dual' | 'none'>('none');
  
  // Initialize all state based on auth context
  useEffect(() => {
    // Set user authentication state
    setIsAuthenticated(auth.isAuthenticated);
    setCurrentUser(auth.userProfile);
    setCurrentExpert(auth.expertProfile);
    
    // Determine specific authentication state
    setIsUserAuthenticated(auth.isAuthenticated && auth.role === 'user' && !!auth.userProfile);
    setIsExpertAuthenticated(auth.isAuthenticated && auth.role === 'expert' && !!auth.expertProfile);
    
    // Check for dual sessions
    setHasDualSessions(auth.userProfile && auth.expertProfile && auth.isAuthenticated);
    
    // Initialize session type from auth context
    setSessionType(auth.sessionType);
    
    // Mark auth as initialized once loading is complete
    if (!auth.isLoading) {
      setIsAuthInitialized(true);
      setInitialized(true);
    }
  }, [auth.isAuthenticated, auth.role, auth.userProfile, auth.expertProfile, auth.isLoading, auth.sessionType]);
  
  // Handle user logout
  const userLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating user logout...");
      const success = await auth.logout();
      
      if (success) {
        // Reset local state
        setIsUserAuthenticated(false);
        setCurrentUser(null);
        
        toast.success('Successfully logged out');
        return true;
      } else {
        toast.error('Error logging out');
        return false;
      }
    } catch (error) {
      console.error('User logout error:', error);
      toast.error('Error during logout');
      return false;
    }
  };
  
  // Handle expert logout
  const expertLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating expert logout...");
      const success = await auth.logout();
      
      if (success) {
        // Reset local state
        setIsExpertAuthenticated(false);
        setCurrentExpert(null);
        
        toast.success('Successfully logged out as expert');
        return true;
      } else {
        toast.error('Error logging out as expert');
        return false;
      }
    } catch (error) {
      console.error('Expert logout error:', error);
      toast.error('Error during expert logout');
      return false;
    }
  };
  
  // Handle full logout - both user and expert
  const fullLogout = async (): Promise<boolean> => {
    try {
      console.log("useAuthSynchronization: Initiating full logout...");
      const success = await auth.logout();
      
      if (success) {
        // Reset all local state
        setIsUserAuthenticated(false);
        setIsExpertAuthenticated(false);
        setCurrentUser(null);
        setCurrentExpert(null);
        setHasDualSessions(false);
        setSessionType('none');
        
        toast.success('Successfully logged out from all accounts');
        return true;
      } else {
        toast.error('Error logging out from accounts');
        return false;
      }
    } catch (error) {
      console.error('Full logout error:', error);
      toast.error('Error during complete logout');
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
    
    // Auth actions
    userLogout,
    expertLogout,
    fullLogout
  };
};
