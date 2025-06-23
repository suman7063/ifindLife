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

const EnhancedUnifiedAuthProviderComponent: React.FC<EnhancedUnifiedAuthProviderProps> = ({ children }) => {
  // Performance monitoring
  useEffect(() => {
    renderCount++;
    console.log('🔒 AuthProvider render count:', renderCount);
  });

  // FIXED: Use single state object to prevent cascade updates and reduce batching
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null as User | null,
    session: null as Session | null,
    sessionType: null as SessionType,
    error: null as string | null,
    userProfile: null as UserProfile | null,
    expertProfile: null as ExpertProfile | null,
    adminProfile: null as AdminProfile | null
  });

  // FIXED: Use ref to prevent unnecessary re-renders
  const updateBatchRef = useRef<NodeJS.Timeout | null>(null);

  // Auth protection hooks
  const { startProtection, endProtection, isProtected } = useAuthProtection();

  // FIXED: Debounced batch update function to prevent Array(5) rapid updates
  const updateAuthState = useCallback((updates: Partial<typeof authState>) => {
    // Clear any pending batch update
    if (updateBatchRef.current) {
      clearTimeout(updateBatchRef.current);
    }

    // Batch updates to prevent rapid state changes
    updateBatchRef.current = setTimeout(() => {
      setAuthState(prevState => {
        const newState = { ...prevState, ...updates };
        
        // Only update if state actually changed
        const hasChanged = Object.keys(updates).some(key => 
          prevState[key as keyof typeof prevState] !== updates[key as keyof typeof updates]
        );
        
        if (!hasChanged) {
          console.log('🔒 Auth state update skipped - no changes');
          return prevState;
        }
        
        console.log('🔒 Auth state batch update applied:', Object.keys(updates));
        return newState;
      });
      updateBatchRef.current = null;
    }, 50); // 50ms debounce to batch rapid updates
  }, []);

  // FIXED: Add loading timeout to prevent indefinite loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (authState.isLoading) {
        console.log('🔒 Auth loading timeout reached, forcing completion');
        updateAuthState({ isLoading: false });
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(loadingTimeout);
  }, [authState.isLoading, updateAuthState]);

  // Fetch profile data for authenticated user
  const fetchProfileForUser = useCallback(async (userId: string, type: SessionType) => {
    try {
      updateAuthState({ isLoading: true });
      
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
      } else {
        updateAuthState({ isLoading: false });
      }
    } catch (error) {
      console.error('🔒 Error fetching profile:', error);
      updateAuthState({ isLoading: false });
    }
  }, [updateAuthState]);

  // FIXED: Enhanced session handler with proper debouncing and no infinite loops
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('🔒 Enhanced auth state change:', {
      event,
      hasSession: !!session,
      isProtected: authProtection.isProtected(),
      userEmail: session?.user?.email || 'No user',
      sessionId: session?.access_token?.substring(0, 10) || 'No token',
      timestamp: new Date().toISOString()
    });
    
    // Prevent cascading updates during protected operations
    if (authProtection.isProtected() && event === 'SIGNED_OUT') {
      console.log('🔒 WARNING: Logout detected during protected operation - this may be unintended');
      const activeOps = authProtection.getActiveOperations();
      console.log('🔒 Active protected operations:', activeOps);
      
      if (activeOps.length > 0) {
        console.log('🔒 Delaying auth state clear due to active operations');
        return;
      }
    }

    try {
      if (session?.user) {
        // Determine session type and fetch appropriate profile
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        
        console.log('🔒 Auth state update:', {
          isAuthenticated: !!session,
          userType: storedSessionType,
          userId: session.user.id,
          isLoading: true
        });
        
        // FIXED: Single batch update to prevent rapid state changes
        updateAuthState({
          session,
          user: session.user,
          isAuthenticated: !!session,
          sessionType: storedSessionType,
          error: null
        });
        
        // Fetch profile based on session type
        if (storedSessionType) {
          await fetchProfileForUser(session.user.id, storedSessionType);
        } else {
          updateAuthState({ isLoading: false });
        }
      } else {
        // Clear all auth state - handle token refresh errors gracefully
        console.log('🔒 Auth state cleared:', {
          isAuthenticated: false,
          userType: null,
          userId: null,
          isLoading: false
        });
        
        // Clear stored session type on logout
        localStorage.removeItem('sessionType');
        
        // FIXED: Single batch clear to prevent multiple rapid updates
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
      
      // Handle token refresh errors gracefully
      if (error instanceof Error && error.message.includes('refresh_token_not_found')) {
        console.log('🔒 Refresh token error - clearing stored session');
        localStorage.removeItem('sessionType');
        await supabase.auth.signOut();
      }
      
      updateAuthState({
        error: 'Authentication state error',
        isLoading: false
      });
    }
  }, [updateAuthState, fetchProfileForUser]);

  // Enhanced login with auth protection and better error handling
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }): Promise<boolean> => {
    const operationId = `login_${Date.now()}`;
    
    try {
      startProtection(operationId, 'booking');
      updateAuthState({ error: null, isLoading: true });

      // Determine session type
      const targetSessionType: SessionType = options?.asExpert ? 'expert' : options?.asAdmin ? 'admin' : 'user';
      localStorage.setItem('sessionType', targetSessionType);

      console.log('🔒 Login attempt:', {
        email,
        targetSessionType,
        operationId,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🔒 Login error:', {
          error: error.message,
          code: error.status,
          targetSessionType
        });
        updateAuthState({ error: error.message, isLoading: false });
        return false;
      }

      if (!data.session) {
        console.error('🔒 Login failed: No session created');
        updateAuthState({ error: 'Login failed - no session created', isLoading: false });
        return false;
      }

      console.log('🔒 Login successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        targetSessionType,
        hasSession: !!data.session
      });
      return true;
    } catch (error) {
      console.error('🔒 Login error:', error);
      updateAuthState({ error: 'Login failed', isLoading: false });
      return false;
    } finally {
      endProtection(operationId);
    }
  }, [startProtection, endProtection, updateAuthState]);

  // Expert registration method
  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      updateAuthState({ isLoading: true, error: null });

      console.log('🔒 Expert registration attempt:', { email });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('🔒 Expert registration error:', error);
        updateAuthState({ error: error.message, isLoading: false });
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        const experience = typeof expertData.experience === 'number' 
          ? String(expertData.experience) 
          : expertData.experience || '';

        const expertProfileData = {
          auth_id: data.user.id,
          email,
          status: 'pending',
          verified: false,
          name: expertData.name || '',
          phone: expertData.phone || '',
          address: expertData.address || '',
          city: expertData.city || '',
          state: expertData.state || '',
          country: expertData.country || '',
          specialization: expertData.specialization || '',
          experience,
          bio: expertData.bio || '',
          profile_picture: expertData.profile_picture || '',
          selected_services: expertData.selected_services || []
        };

        const { error: profileError } = await supabase
          .from('expert_accounts')
          .insert(expertProfileData);

        if (profileError) {
          console.error('🔒 Expert profile creation error:', profileError);
          updateAuthState({ 
            error: `Failed to create expert profile: ${profileError.message}`,
            isLoading: false 
          });
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        await supabase.auth.signOut();
        
        console.log('🔒 Expert registration successful:', { email });
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

  // Enhanced logout with protection check and better error handling
  const logout = useCallback(async (): Promise<void> => {
    try {
      if (authProtection.isProtected()) {
        console.log('🔒 WARNING: Logout requested during protected operation');
        const activeOps = authProtection.getActiveOperations();
        
        if (activeOps.some(op => op.type === 'video-call')) {
          toast.error('Cannot logout during an active video call');
          return;
        }
        
        if (activeOps.length > 0) {
          toast.warning('Logout during active operation - some data may be lost');
        }
      }

      updateAuthState({ isLoading: true });
      
      console.log('🔒 Logout initiated:', {
        currentSessionType: authState.sessionType,
        hasUser: !!authState.user,
        timestamp: new Date().toISOString()
      });
      
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
  }, [authState.sessionType, authState.user, updateAuthState]);

  // FIXED: Initialize auth state with proper dependency management
  useEffect(() => {
    console.log('🔒 Initializing enhanced unified auth');
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        handleAuthStateChange(event, session);
      }
    });

    // Check for existing session - prevent double firing
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthStateChange('INITIAL_SESSION', session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (updateBatchRef.current) {
        clearTimeout(updateBatchRef.current);
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Compute current active profiles based on session type for backward compatibility
  const currentAdmin = useMemo(() => 
    authState.sessionType === 'admin' ? authState.adminProfile : null, 
    [authState.sessionType, authState.adminProfile]
  );
  
  const currentExpert = useMemo(() => 
    authState.sessionType === 'expert' ? authState.expertProfile : null, 
    [authState.sessionType, authState.expertProfile]
  );

  // FIXED: Ultra-stable context value to prevent unnecessary re-renders
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

    // Auth actions
    login,
    logout,
    registerExpert,
    
    // Auth protection
    startAuthProtection: startProtection,
    endAuthProtection: endProtection,
    isAuthProtected: isProtected
  }), [
    // FIXED: Use authState object directly to prevent object recreation
    authState,
    currentAdmin,
    currentExpert,
    login,
    logout,
    registerExpert,
    startProtection,
    endProtection,
    isProtected
  ]);

  console.log('🔒 EnhancedUnifiedAuthProvider providing stable value:', { 
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
