
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';
import { authProtection, useAuthProtection } from '@/utils/authProtection';
import { toast } from 'sonner';

// Debug React availability
console.log('EnhancedUnifiedAuthContext - React:', !!React);
console.log('EnhancedUnifiedAuthContext - useState:', !!useState);

type SessionType = 'user' | 'expert' | 'admin' | null;

interface EnhancedUnifiedAuthContextType {
  // Core auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  sessionType: SessionType;
  error: string | null;

  // Profile data - individual profiles
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  adminProfile: AdminProfile | null;

  // Profile data - current active profiles (for backward compatibility)
  admin: AdminProfile | null;
  expert: ExpertProfile | null;

  // Auth actions with protection
  login: (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }) => Promise<boolean>;
  logout: () => Promise<void>;
  registerExpert: (email: string, password: string, expertData: Partial<ExpertProfile>) => Promise<boolean>;
  
  // Auth protection utilities
  startAuthProtection: (operationId: string, type?: 'video-call' | 'booking' | 'payment') => void;
  endAuthProtection: (operationId: string) => void;
  isAuthProtected: () => boolean;
}

const EnhancedUnifiedAuthContext = createContext<EnhancedUnifiedAuthContextType | undefined>(undefined);

export const useEnhancedUnifiedAuth = () => {
  const context = useContext(EnhancedUnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedUnifiedAuth must be used within an EnhancedUnifiedAuthProvider');
  }
  return context;
};

interface EnhancedUnifiedAuthProviderProps {
  children: React.ReactNode;
}

// Add render counter for performance monitoring
let renderCount = 0;

// FIXED: Helper function to prevent state loops during render
const createStableAuthState = (
  user: User | null,
  session: Session | null,
  sessionType: SessionType,
  userProfile: UserProfile | null,
  expertProfile: ExpertProfile | null,
  adminProfile: AdminProfile | null,
  isLoading: boolean,
  error: string | null
) => {
  const isAuthenticated = Boolean(user && session && !isLoading);
  
  return {
    isAuthenticated,
    isLoading,
    user,
    session,
    sessionType,
    error,
    userProfile,
    expertProfile,
    adminProfile
  };
};

const EnhancedUnifiedAuthProviderComponent: React.FC<EnhancedUnifiedAuthProviderProps> = ({ children }) => {
  // Performance monitoring
  useEffect(() => {
    renderCount++;
    console.log('🔒 AuthProvider render count:', renderCount);
  });

  // FIXED: Stable auth state to prevent infinite loops
  const [authState, setAuthState] = useState(() => createStableAuthState(
    null, null, null, null, null, null, true, null
  ));

  // FIXED: Prevent state updates during render phase
  const isUpdatingRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auth protection hooks
  const { startProtection, endProtection, isProtected } = useAuthProtection();

  // FIXED: Safe state update function to prevent cascading updates
  const updateAuthState = useCallback((updates: Partial<typeof authState>) => {
    // Prevent updates during render phase
    if (isUpdatingRef.current) {
      console.log('🔒 Auth state update blocked - already updating');
      return;
    }

    // Clear any pending update
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Batch updates with minimal delay to prevent cascading
    updateTimeoutRef.current = setTimeout(() => {
      isUpdatingRef.current = true;
      
      setAuthState(prevState => {
        const newState = { ...prevState, ...updates };
        
        // Only update if state actually changed
        const hasChanged = Object.keys(updates).some(key => 
          prevState[key as keyof typeof prevState] !== updates[key as keyof typeof updates]
        );
        
        if (!hasChanged) {
          console.log('🔒 Auth state update skipped - no changes');
          isUpdatingRef.current = false;
          return prevState;
        }
        
        console.log('🔒 Auth state updated:', Object.keys(updates));
        isUpdatingRef.current = false;
        return newState;
      });
      
      updateTimeoutRef.current = null;
    }, 10); // Minimal delay to prevent infinite loops
  }, []);

  // FIXED: Safe profile fetching with proper error handling
  const fetchProfileForUser = useCallback(async (userId: string, type: SessionType) => {
    try {
      if (type === 'user') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('🔒 No user profile found:', error);
          updateAuthState({ userProfile: null, isLoading: false });
          return;
        }
        
        updateAuthState({ userProfile: data, isLoading: false });
        console.log('🔒 User profile loaded:', { hasProfile: !!data, userId });
      } else if (type === 'expert') {
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('🔒 No expert profile found:', error);
          updateAuthState({ expertProfile: null, isLoading: false });
          return;
        }
        
        updateAuthState({ expertProfile: data, isLoading: false });
        console.log('🔒 Expert profile loaded:', { hasProfile: !!data, userId });
      } else if (type === 'admin') {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('🔒 No admin profile found:', error);
          updateAuthState({ adminProfile: null, isLoading: false });
          return;
        }
        
        updateAuthState({ adminProfile: data, isLoading: false });
        console.log('🔒 Admin profile loaded:', { hasProfile: !!data, userId });
      }
    } catch (error) {
      console.error('🔒 Error fetching profile:', error);
      updateAuthState({ isLoading: false });
    }
  }, [updateAuthState]);

  // FIXED: Enhanced session handler with proper guards against infinite loops
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('🔒 Enhanced auth state change:', {
      event,
      hasSession: !!session,
      isProtected: authProtection.isProtected(),
      userEmail: session?.user?.email || 'No user',
      timestamp: new Date().toISOString()
    });
    
    // CRITICAL: Prevent state updates during render or when already updating
    if (isUpdatingRef.current) {
      console.log('🔒 Auth state change blocked - already updating');
      return;
    }
    
    // Prevent cascading updates during protected operations
    if (authProtection.isProtected() && event === 'SIGNED_OUT') {
      console.log('🔒 WARNING: Logout detected during protected operation');
      const activeOps = authProtection.getActiveOperations();
      if (activeOps.length > 0) {
        console.log('🔒 Delaying auth state clear due to active operations');
        return;
      }
    }

    try {
      if (session?.user) {
        // Determine session type
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        
        console.log('🔒 Processing auth session:', {
          userId: session.user.id,
          sessionType: storedSessionType,
          isLoading: true
        });
        
        // FIXED: Single batch update to prevent cascading
        updateAuthState({
          session,
          user: session.user,
          isAuthenticated: true,
          sessionType: storedSessionType,
          error: null,
          isLoading: true
        });
        
        // Fetch profile based on session type
        if (storedSessionType) {
          await fetchProfileForUser(session.user.id, storedSessionType);
        } else {
          updateAuthState({ isLoading: false });
        }
      } else {
        // Clear all auth state
        console.log('🔒 Clearing auth state');
        
        localStorage.removeItem('sessionType');
        
        // FIXED: Single batch clear to prevent cascading
        updateAuthState({
          session: null,
          user: null,
          isAuthenticated: false,
          sessionType: null,
          userProfile: null,
          expertProfile: null,
          adminProfile: null,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('🔒 Error in auth state change handler:', error);
      updateAuthState({
        error: 'Authentication state error',
        isLoading: false
      });
    }
  }, [updateAuthState, fetchProfileForUser]);

  // FIXED: Stable login function with proper error handling
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }): Promise<boolean> => {
    const operationId = `login_${Date.now()}`;
    
    try {
      startProtection(operationId, 'booking');
      updateAuthState({ error: null, isLoading: true });

      const targetSessionType: SessionType = options?.asExpert ? 'expert' : options?.asAdmin ? 'admin' : 'user';
      localStorage.setItem('sessionType', targetSessionType);

      console.log('🔒 Login attempt:', { email, targetSessionType });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🔒 Login error:', error);
        updateAuthState({ error: error.message, isLoading: false });
        return false;
      }

      if (!data.session) {
        console.error('🔒 Login failed: No session created');
        updateAuthState({ error: 'Login failed - no session created', isLoading: false });
        return false;
      }

      console.log('🔒 Login successful:', { userId: data.user?.id, email: data.user?.email });
      return true;
    } catch (error) {
      console.error('🔒 Login error:', error);
      updateAuthState({ error: 'Login failed', isLoading: false });
      return false;
    } finally {
      endProtection(operationId);
    }
  }, [startProtection, endProtection, updateAuthState]);

  // FIXED: Stable logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      if (authProtection.isProtected()) {
        const activeOps = authProtection.getActiveOperations();
        if (activeOps.some(op => op.type === 'video-call')) {
          toast.error('Cannot logout during an active video call');
          return;
        }
      }

      updateAuthState({ isLoading: true });
      
      console.log('🔒 Logout initiated');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔒 Logout error:', error);
        toast.error('Logout failed');
        updateAuthState({ isLoading: false });
        return;
      }

      localStorage.removeItem('sessionType');
      authProtection.clearAllProtections();
      
      console.log('🔒 Logout completed successfully');
    } catch (error) {
      console.error('🔒 Logout error:', error);
      toast.error('Logout failed');
      updateAuthState({ isLoading: false });
    }
  }, [updateAuthState]);

  // Expert registration method
  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      updateAuthState({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        updateAuthState({ error: error.message, isLoading: false });
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        const expertProfileData = {
          auth_id: data.user.id,
          email,
          status: 'pending',
          verified: false,
          name: expertData.name || '',
          phone: expertData.phone || '',
          specialization: expertData.specialization || '',
          experience: String(expertData.experience || ''),
          bio: expertData.bio || '',
          selected_services: expertData.selected_services || []
        };

        const { error: profileError } = await supabase
          .from('expert_accounts')
          .insert(expertProfileData);

        if (profileError) {
          updateAuthState({ 
            error: `Failed to create expert profile: ${profileError.message}`,
            isLoading: false 
          });
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        await supabase.auth.signOut();
        toast.success('Expert account created successfully! Your profile is pending approval.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('🔒 Expert registration error:', error);
      updateAuthState({ 
        error: 'Failed to create expert account. Please try again.',
        isLoading: false 
      });
      toast.error('Failed to create expert account. Please try again.');
      return false;
    }
  }, [updateAuthState]);

  // FIXED: Initialize auth state with proper cleanup
  useEffect(() => {
    console.log('🔒 Initializing enhanced unified auth');
    
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        handleAuthStateChange(event, session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthStateChange('INITIAL_SESSION', session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  // FIXED: Stable computed values
  const currentAdmin = useMemo(() => 
    authState.sessionType === 'admin' ? authState.adminProfile : null, 
    [authState.sessionType, authState.adminProfile]
  );
  
  const currentExpert = useMemo(() => 
    authState.sessionType === 'expert' ? authState.expertProfile : null, 
    [authState.sessionType, authState.expertProfile]
  );

  // FIXED: Ultra-stable context value with minimal dependencies
  const contextValue = useMemo((): EnhancedUnifiedAuthContextType => ({
    // Core auth state
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    session: authState.session,
    sessionType: authState.sessionType,
    error: authState.error,

    // Profile data - individual profiles
    userProfile: authState.userProfile,
    expertProfile: authState.expertProfile,
    adminProfile: authState.adminProfile,

    // Profile data - current active profiles (for backward compatibility)
    admin: currentAdmin,
    expert: currentExpert,

    // Auth actions - stable references
    login,
    logout,
    registerExpert,
    
    // Auth protection - stable references
    startAuthProtection: startProtection,
    endAuthProtection: endProtection,
    isAuthProtected: isProtected
  }), [
    // FIXED: Use individual auth state properties instead of whole object
    authState.isAuthenticated,
    authState.isLoading,
    authState.user,
    authState.session,
    authState.sessionType,
    authState.error,
    authState.userProfile,
    authState.expertProfile,
    authState.adminProfile,
    currentAdmin,
    currentExpert,
    login,
    logout,
    registerExpert,
    startProtection,
    endProtection,
    isProtected
  ]);

  console.log('🔒 EnhancedUnifiedAuthProvider stable context value:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading, 
    hasUser: !!authState.user, 
    sessionType: authState.sessionType,
    renderCount
  });

  return (
    <EnhancedUnifiedAuthContext.Provider value={contextValue}>
      {children}
    </EnhancedUnifiedAuthContext.Provider>
  );
};

// FIXED: Proper memoization to prevent unnecessary re-renders
export const EnhancedUnifiedAuthProvider = React.memo(EnhancedUnifiedAuthProviderComponent);
