
import { useEffect, useState } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import { toast } from 'sonner';

/**
 * This hook synchronizes authentication state between user and expert contexts
 * and prevents simultaneous login to both accounts
 */
export const useAuthSynchronization = () => {
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  
  // Access both auth contexts
  const { isAuthenticated: isUserAuthenticated, currentUser, logout: userLogout } = useUserAuth();
  const { expert, loading: expertLoading, logout: expertLogout } = useExpertAuth();
  
  // Derived state
  const isExpertAuthenticated = !!expert && !expertLoading;
  
  // Track synchronization attempts to prevent infinite loops
  const [syncAttempts, setSyncAttempts] = useState(0);
  
  // Effect to handle logout synchronization
  useEffect(() => {
    // Limit synchronization attempts to prevent potential infinite loops
    if (syncAttempts > 3) {
      console.error("Too many synchronization attempts, aborting");
      return;
    }
    
    // If we're already handling a sync operation, skip this effect cycle
    if (isSynchronizing) return;
    
    const handleConflictingAuth = async () => {
      try {
        setIsSynchronizing(true);
        
        if (isUserAuthenticated && isExpertAuthenticated) {
          console.log("Conflicting auth detected: User and Expert are both authenticated");
          // Choose which one to log out based on current route
          // For now, prioritize the user auth
          
          // For simplicity, we'll log out of expert account if both are logged in
          console.log("Logging out of expert account to resolve auth conflict");
          await expertLogout();
          toast.info("You've been logged out as an expert to avoid conflict with your user account");
        }
      } catch (error) {
        console.error("Error during auth synchronization:", error);
      } finally {
        setIsSynchronizing(false);
        setSyncAttempts(prev => prev + 1);
      }
    };
    
    // Check for conflicting authentication states
    if (isUserAuthenticated && isExpertAuthenticated) {
      handleConflictingAuth();
    }
  }, [
    isUserAuthenticated, 
    isExpertAuthenticated, 
    expertLogout, 
    userLogout, 
    isSynchronizing,
    syncAttempts
  ]);
  
  return {
    isUserAuthenticated,
    isExpertAuthenticated,
    isSynchronizing,
    currentUser,
    expertProfile: expert
  };
};
