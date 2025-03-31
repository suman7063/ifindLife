
import { useEffect, useState, useCallback } from 'react';
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
  const { isAuthenticated: isUserAuthenticatedContext, currentUser, logout: userLogout, user: supabaseUser } = useUserAuth();
  const { expert, loading: expertLoading, logout: expertLogout, authInitialized: expertAuthInitialized } = useExpertAuth();
  
  // Derived state - ensure we check for both user session and profile
  const isUserAuthenticated = !!supabaseUser && !!currentUser && isUserAuthenticatedContext;
  const isExpertAuthenticated = !!expert && !expertLoading && expertAuthInitialized;
  
  // Enhance logout functions with better error handling and state updates
  const handleUserLogout = useCallback(async (): Promise<boolean> => {
    if (isSynchronizing) return false;
    
    try {
      setIsSynchronizing(true);
      console.log("useAuthSynchronization: Executing user logout");
      const success = await userLogout();
      
      if (success) {
        console.log("useAuthSynchronization: User logout successful");
        return true;
      } else {
        console.error("useAuthSynchronization: User logout failed");
        return false;
      }
    } catch (error) {
      console.error("useAuthSynchronization: Error during user logout:", error);
      return false;
    } finally {
      setIsSynchronizing(false);
    }
  }, [userLogout, isSynchronizing]);

  const handleExpertLogout = useCallback(async (): Promise<boolean> => {
    if (isSynchronizing) return false;
    
    try {
      setIsSynchronizing(true);
      console.log("useAuthSynchronization: Executing expert logout");
      // Handle the boolean return value from expertLogout
      const success = await expertLogout();
      console.log("useAuthSynchronization: Expert logout result:", success);
      return success;
    } catch (error) {
      console.error("useAuthSynchronization: Error during expert logout:", error);
      return false;
    } finally {
      setIsSynchronizing(false);
    }
  }, [expertLogout, isSynchronizing]);
  
  // Effect to handle auth conflict resolution
  useEffect(() => {
    // Skip if not fully initialized or already handling a sync operation
    if (isSynchronizing || expertLoading) return;
    
    const handleConflictingAuth = async () => {
      if (isUserAuthenticated && isExpertAuthenticated) {
        console.log("Conflicting auth detected: User and Expert are both authenticated");
        
        try {
          setIsSynchronizing(true);
          // For simplicity, we'll log out of expert account if both are logged in
          console.log("Logging out of expert account to resolve auth conflict");
          const success = await expertLogout();
          
          if (success) {
            toast.info("You've been logged out as an expert to avoid conflict with your user account");
          } else {
            // If expert logout fails, try user logout as fallback
            console.log("Expert logout failed, attempting user logout instead");
            await userLogout();
            toast.info("You've been logged out as a user to avoid auth conflict");
          }
        } catch (error) {
          console.error("Error during auth synchronization:", error);
        } finally {
          setIsSynchronizing(false);
        }
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
    expertLoading
  ]);
  
  return {
    isUserAuthenticated,
    isExpertAuthenticated,
    isSynchronizing,
    currentUser,
    expertProfile: expert,
    userLogout: handleUserLogout,
    expertLogout: handleExpertLogout
  };
};
