
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
  const { 
    isAuthenticated, 
    currentUser, 
    logout: userLogout, 
    user: supabaseUser,
    authLoading: userAuthLoading 
  } = useUserAuth();
  const { 
    expert, 
    loading: expertLoading, 
    logout: expertLogout, 
    authInitialized: expertAuthInitialized 
  } = useExpertAuth();
  
  // Derived state - ensure we check for both user session and profile
  const isExpertAuthenticated = !!expert && !expertLoading && expertAuthInitialized;
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log("Auth Synchronization state:", {
      isAuthenticated,
      hasUserProfile: !!currentUser,
      hasSupabaseUser: !!supabaseUser,
      userAuthLoading,
      isExpertAuthenticated,
      hasExpertProfile: !!expert,
      expertLoading,
      expertAuthInitialized,
      isSynchronizing
    });
  }, [
    isAuthenticated, 
    currentUser, 
    supabaseUser, 
    userAuthLoading,
    isExpertAuthenticated,
    expert,
    expertLoading,
    expertAuthInitialized,
    isSynchronizing
  ]);
  
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
        // Force page reload as a last resort
        window.location.href = '/';
        return false;
      }
    } catch (error) {
      console.error("useAuthSynchronization: Error during user logout:", error);
      // Force page reload as a last resort
      window.location.href = '/';
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
      const success = await expertLogout();
      
      if (success) {
        console.log("useAuthSynchronization: Expert logout successful");
        return true;
      } else {
        console.error("useAuthSynchronization: Expert logout failed");
        // Force page reload as a last resort
        window.location.href = '/';
        return false;
      }
    } catch (error) {
      console.error("useAuthSynchronization: Error during expert logout:", error);
      // Force page reload as a last resort
      window.location.href = '/';
      return false;
    } finally {
      setIsSynchronizing(false);
    }
  }, [expertLogout, isSynchronizing]);
  
  // Effect to handle auth conflict resolution - but don't run on every render
  useEffect(() => {
    // Skip if not fully initialized, already handling a sync operation, or still loading
    if (isSynchronizing || userAuthLoading || expertLoading || !expertAuthInitialized) {
      return;
    }
    
    // Only run this effect when both auth states are true simultaneously
    if (isAuthenticated && isExpertAuthenticated) {
      const handleConflictingAuth = async () => {
        console.log("Conflicting auth detected: User and Expert are both authenticated");
        
        try {
          setIsSynchronizing(true);
          // For simplicity, we'll log out of expert account if both are logged in
          console.log("Logging out of expert account to resolve auth conflict");
          
          await expertLogout();
          toast.info("You've been logged out as an expert to avoid conflict with your user account");
          
          // Force refresh the page after logout
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          console.error("Error during auth synchronization:", error);
          // Force a page reload as a last resort
          window.location.reload();
        } finally {
          setIsSynchronizing(false);
        }
      };
      
      handleConflictingAuth();
    }
  }, [
    isAuthenticated, 
    isExpertAuthenticated, 
    expertLogout,
    isSynchronizing,
    userAuthLoading,
    expertLoading,
    expertAuthInitialized
  ]);
  
  return {
    isAuthenticated,
    isExpertAuthenticated,
    isSynchronizing,
    currentUser,
    expertProfile: expert,
    userLogout: handleUserLogout,
    expertLogout: handleExpertLogout
  };
};
