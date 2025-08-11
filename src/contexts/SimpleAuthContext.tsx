import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { fetchUserProfile } from '@/utils/profileFetcher';
import { ExpertProfile, UserProfile } from '@/types/database/unified';
import { expertRepository } from '@/repositories';
import { toast } from 'sonner';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { secureLogger } from '@/utils/secureLogger';
import { secureStorage } from '@/utils/secureStorage';

export type UserType = 'user' | 'expert' | 'dual' | 'none';

export interface LoginOptions {
  asExpert?: boolean;
  redirectTo?: string;
  remember?: boolean;
}

export interface SimpleAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userType: UserType;
  userProfile: UserProfile | null;
  expert: ExpertProfile | null;
  login: (email: string, password: string, options?: LoginOptions) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  refreshProfiles: (userId?: string) => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

// SESSION TIMEOUT CONSTANTS
const SESSION_TIMEOUT = 10000; // 10 seconds timeout for auth operations
const PROFILE_LOAD_TIMEOUT = 8000; // 8 seconds timeout for profile loading

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [userType, setUserType] = useState<UserType>('none');
  
  // Anti-race condition flags
  const initializationRef = useRef(false);
  const profileLoadingRef = useRef(false);
  
  // Computed authentication state
  const isAuthenticated = useMemo(() => Boolean(session && user), [session, user]);

  // Helper to determine user type from profiles
  const determineUserType = useCallback((userProfile: UserProfile | null, expertProfile: ExpertProfile | null): UserType => {
    if (userProfile && expertProfile) return 'dual';
    if (expertProfile?.status === 'approved') return 'expert';
    if (userProfile) return 'user';
    return 'none';
  }, []);

  // Session storage utilities (standardized approach)
  const storeSessionData = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(`auth_${key}`, JSON.stringify(value));
    } catch (error) {
      // Silently fail for storage issues
    }
  }, []);

  const getStoredSessionData = useCallback((key: string) => {
    try {
      const item = localStorage.getItem(`auth_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  }, []);
  
  // Timeout wrapper for async operations
  const withTimeout = useCallback(function<T>(
    promise: Promise<T>, 
    timeoutMs: number, 
    errorMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
      )
    ]);
  }, []);

  // Profile loading with timeout and anti-race conditions
  const refreshProfiles = useCallback(async (targetUserId?: string) => {
    const userId = targetUserId || user?.id;
    if (!userId || profileLoadingRef.current) return;

    profileLoadingRef.current = true;
    
    try {
      // Load profiles with timeout protection
      const [userProfileResult, expertProfileResult] = await withTimeout(
        Promise.allSettled([
          fetchUserProfile({ id: userId }),
          expertRepository.getExpertByAuthId(userId)
        ]),
        PROFILE_LOAD_TIMEOUT,
        'Profile loading timeout'
      );
      
      const loadedUserProfile = userProfileResult.status === 'fulfilled' ? userProfileResult.value : null;
      const loadedExpertProfile = expertProfileResult.status === 'fulfilled' ? expertProfileResult.value : null;
      
      const newUserType = determineUserType(loadedUserProfile, loadedExpertProfile);
      
      // Update state atomically
      setUserProfile(loadedUserProfile);
      setExpert(loadedExpertProfile);
      setUserType(newUserType);
      
      // Cache results
      if (loadedUserProfile) storeSessionData('userProfile', loadedUserProfile);
      if (loadedExpertProfile) storeSessionData('expert', loadedExpertProfile);
      storeSessionData('userType', newUserType);
      
    } catch (error) {
      // Use cached data as fallback
      const cachedUserProfile = getStoredSessionData('userProfile');
      const cachedExpert = getStoredSessionData('expert');
      const cachedUserType = getStoredSessionData('userType') || 'none';
      
      setUserProfile(cachedUserProfile);
      setExpert(cachedExpert);
      setUserType(cachedUserType);
      
    } finally {
      profileLoadingRef.current = false;
    }
  }, [user?.id, withTimeout, determineUserType, storeSessionData, getStoredSessionData]);

  // Login function with timeout protection
  const login = useCallback(async (email: string, password: string, options: LoginOptions = {}): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        SESSION_TIMEOUT,
        'Login timeout - please try again'
      );
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data.session) {
        // Store login options for profile loading
        if (options.asExpert) {
          storeSessionData('loginAsExpert', true);
        }
        
        toast.success('Login successful!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [withTimeout, storeSessionData]);

  // Update password function
  const updatePassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      // Validate password strength before updating
      const validation = validatePasswordStrength(password);
      if (!validation.isValid) {
        toast.error(validation.feedback);
        return false;
      }

      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      secureLogger.error('Password update failed:', error);
      toast.error('Failed to update password');
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      await supabase.auth.signOut();
      
      // Clear all stored data
      ['userProfile', 'expert', 'userType', 'loginAsExpert'].forEach(key => {
        localStorage.removeItem(`auth_${key}`);
      });
      
      // Reset state
      setUserProfile(null);
      setExpert(null);
      setUserType('none');
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      toast.error('Logout failed');
      return false;
    }
  }, []);

  // Single auth initialization with timeout protection and memory leak prevention
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    let mounted = true;
    let authTimeout: NodeJS.Timeout;
    
    const initializeAuth = async () => {
      try {
        // Set loading timeout fallback
        authTimeout = setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, SESSION_TIMEOUT);
        
        const { data: { session }, error } = await withTimeout(
          supabase.auth.getSession(),
          SESSION_TIMEOUT,
          'Session check timeout'
        );
        
        if (!mounted) return;
        clearTimeout(authTimeout);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          // Profiles will be loaded by auth state listener
        } else {
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
      } catch (error) {
        // Use fallback cached data on initialization failure
        const cachedUserProfile = getStoredSessionData('userProfile');
        const cachedExpert = getStoredSessionData('expert');
        const cachedUserType = getStoredSessionData('userType') || 'none';
        
        if (cachedUserProfile || cachedExpert) {
          setUserProfile(cachedUserProfile);
          setExpert(cachedExpert);
          setUserType(cachedUserType);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // Single auth state listener with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load profiles with delay to prevent race conditions
          setTimeout(() => {
            if (mounted) {
              refreshProfiles(session.user.id);
            }
          }, 50);
        } else {
          // Clear state on logout
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
        if (mounted && event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      mounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [withTimeout, refreshProfiles, getStoredSessionData]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated,
    isLoading,
    user,
    session,
    userType,
    userProfile,
    expert,
    login,
    logout,
    updatePassword,
    refreshProfiles
  }), [isAuthenticated, isLoading, user, session, userType, userProfile, expert, login, logout, updatePassword, refreshProfiles]);

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = (): SimpleAuthContextType => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};