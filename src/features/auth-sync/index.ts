
import { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { AuthSyncState, SessionType, UseAuthSynchronizationReturn } from '@/hooks/auth-sync/types';

// A simplified version that uses hooks/auth-sync/index.ts implementation under the hood
export const useAuthSynchronization = (): UseAuthSynchronizationReturn => {
  const auth = useAuth();
  const [syncState, setSyncState] = useState<AuthSyncState>({
    isUserAuthenticated: !!auth.userProfile,
    isExpertAuthenticated: !!auth.expertProfile,
    isSynchronizing: false,
    isAuthInitialized: true,
    authCheckCompleted: true,
    hasDualSessions: !!auth.userProfile && !!auth.expertProfile,
    sessionType: getSessionType(!!auth.userProfile, !!auth.expertProfile),
    currentUser: auth.userProfile || null,
    currentExpert: auth.expertProfile || null
  });
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Determine session type based on authenticated profiles
  function getSessionType(hasUserProfile: boolean, hasExpertProfile: boolean): SessionType {
    if (hasUserProfile && hasExpertProfile) return 'dual';
    if (hasUserProfile) return 'user';
    if (hasExpertProfile) return 'expert';
    return 'none';
  }
  
  // Sync auth state
  const syncAuthState = async (): Promise<boolean> => {
    try {
      setSyncState((prev) => ({ ...prev, isSynchronizing: true }));
      // In a real implementation, this would re-fetch profiles from the backend
      toast.info("Synchronizing authentication state...");
      await new Promise(r => setTimeout(r, 500)); // Simulate API call
      
      setSyncState((prev) => ({
        ...prev, 
        isUserAuthenticated: !!auth.userProfile,
        isExpertAuthenticated: !!auth.expertProfile,
        hasDualSessions: !!auth.userProfile && !!auth.expertProfile,
        sessionType: getSessionType(!!auth.userProfile, !!auth.expertProfile),
        currentUser: auth.userProfile || null,
        currentExpert: auth.expertProfile || null,
        isSynchronizing: false
      }));
      
      return true;
    } catch (error) {
      console.error("Error syncing auth state:", error);
      toast.error("Failed to synchronize authentication state");
      setSyncState((prev) => ({ ...prev, isSynchronizing: false }));
      return false;
    }
  };
  
  // Logout methods
  const userLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      const success = await auth.logout();
      if (success) {
        toast.success("User logged out successfully");
      }
      setIsLoggingOut(false);
      return success;
    } catch (error) {
      console.error("Error logging out user:", error);
      toast.error("Failed to log out user");
      setIsLoggingOut(false);
      return false;
    }
  };
  
  const expertLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      const success = await auth.logout();
      if (success) {
        toast.success("Expert logged out successfully");
      }
      setIsLoggingOut(false);
      return success;
    } catch (error) {
      console.error("Error logging out expert:", error);
      toast.error("Failed to log out expert");
      setIsLoggingOut(false);
      return false;
    }
  };
  
  const fullLogout = async (): Promise<boolean> => {
    try {
      setIsLoggingOut(true);
      const success = await auth.logout();
      if (success) {
        toast.success("Logged out from all sessions successfully");
      }
      setIsLoggingOut(false);
      return success;
    } catch (error) {
      console.error("Error performing full logout:", error);
      toast.error("Failed to log out from all sessions");
      setIsLoggingOut(false);
      return false;
    }
  };

  return {
    syncAuthState,
    userLogout,
    expertLogout,
    fullLogout,
    isUserAuthenticated: syncState.isUserAuthenticated,
    isExpertAuthenticated: syncState.isExpertAuthenticated,
    isAuthenticated: syncState.isUserAuthenticated || syncState.isExpertAuthenticated,
    isAuthInitialized: syncState.isAuthInitialized,
    isAuthLoading: syncState.isSynchronizing || auth.isLoading,
    authCheckCompleted: syncState.authCheckCompleted,
    isSynchronizing: syncState.isSynchronizing,
    currentUser: syncState.currentUser || null,
    currentExpert: syncState.currentExpert || null,
    hasDualSessions: syncState.hasDualSessions,
    sessionType: syncState.sessionType,
    isLoggingOut
  };
};
