
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile, AdminProfile } from '@/types/database/unified';
import { authProtection, useAuthProtection } from '@/utils/authProtection';
import { toast } from 'sonner';

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

// FIXED: Initial stable auth state
const createInitialAuthState = () => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  sessionType: null as SessionType,
  error: null,
  userProfile: null,
  expertProfile: null,
  adminProfile: null
});

// FIXED: Deep equality check to prevent unnecessary updates
const isAuthStateEqual = (prev: any, next: any): boolean => {
  return (
    prev.isAuthenticated === next.isAuthenticated &&
    prev.isLoading === next.isLoading &&
    prev.user?.id === next.user?.id &&
    prev.session?.access_token === next.session?.access_token &&
    prev.sessionType === next.sessionType &&
    prev.error === next.error &&
    prev.userProfile?.id === next.userProfile?.id &&
    prev.expertProfile?.id === next.expertProfile?.id &&
    prev.adminProfile?.id === next.adminProfile?.id
  );
};

const EnhancedUnifiedAuthProviderComponent: React.FC<EnhancedUnifiedAuthProviderProps> = ({ children }) => {
  // FIXED: Critical initialization guard
  const [isInitialized, setIsInitialized] = useState(false);
  const [authState, setAuthState] = useState(createInitialAuthState);
  
  // FIXED: Processing guards to prevent loops
  const isProcessingSession = useRef(false);
  const isUpdatingState = useRef(false);
  const initializationStarted = useRef(false);
  
  // Auth protection hooks
  const { startProtection, endProtection, isProtected } = useAuthProtection();

  // FIXED: Truly stable state update function with deep equality check
  const updateAuthState = useCallback((updates: Partial<typeof authState>) => {
    if (isUpdatingState.current) {
      console.log('🔒 Auth state update blocked - already updating');
      return;
    }

    setAuthState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // CRITICAL: Deep equality check to prevent unnecessary updates
      if (isAuthStateEqual(prevState, newState)) {
        console.log('🔒 Auth state update skipped - no actual changes detected');
        return prevState;
      }
      
      console.log('🔒 Auth state updated with changes:', Object.keys(updates));
      return newState;
    });
  }, []);

  // FIXED: Stable profile fetching with proper error handling
  const fetchProfileForUser = useCallback(async (userId: string, type: SessionType) => {
    try {
      console.log(`🔒 Fetching ${type} profile for user:`, userId);
      
      if (type === 'user') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('🔒 No user profile found:', error.message);
          return null;
        }
        
        console.log('🔒 User profile loaded successfully');
        return { userProfile: data };
      } else if (type === 'expert') {
        // FIXED: Use correct table name and column name for expert profile query
        const { data, error } = await supabase
          .from('expert_accounts')  // FIXED: Changed from 'experts' to 'expert_accounts'
          .select('*')
          .eq('auth_id', userId)    // FIXED: Changed from 'id' to 'auth_id'
          .eq('status', 'approved') // FIXED: Only fetch approved experts
          .single();
        
        if (error) {
          console.log('🔒 No expert profile found:', error.message);
          return null;
        }
        
        console.log('🔒 Expert profile loaded successfully');
        return { expertProfile: data };
      } else if (type === 'admin') {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('🔒 No admin profile found:', error.message);
          return null;
        }
        
        console.log('🔒 Admin profile loaded successfully');
        return { adminProfile: data };
      }
      
      return null;
    } catch (error) {
      console.error('🔒 Error fetching profile:', error);
      return null;
    }
  }, []);

  // FIXED: Optimized session handler with processing guard
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    // CRITICAL: Prevent multiple simultaneous processing
    if (isProcessingSession.current) {
      console.log('🔒 Session processing already in progress - skipping');
      return;
    }
    
    console.log('🔒 Enhanced auth state change:', {
      event,
      hasSession: !!session,
      isProtected: authProtection.isProtected(),
      userEmail: session?.user?.email || 'No user'
    });
    
    // Prevent cascading updates during protected operations
    if (authProtection.isProtected() && event === 'SIGNED_OUT') {
      console.log('🔒 WARNING: Logout detected during protected operation - deferring');
      return;
    }

    isProcessingSession.current = true;

    try {
      if (session?.user) {
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        
        console.log('🔒 Processing auth session for user:', session.user.email);
        
        // FIXED: Single batch update with basic auth data
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
          const profileData = await fetchProfileForUser(session.user.id, storedSessionType);
          
          if (profileData) {
            updateAuthState({
              ...profileData,
              isLoading: false
            });
          } else {
            updateAuthState({ isLoading: false });
          }
        } else {
          updateAuthState({ isLoading: false });
        }
      } else {
        console.log('🔒 Clearing auth state - no session');
        
        localStorage.removeItem('sessionType');
        
        // FIXED: Single batch clear
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
    } finally {
      isProcessingSession.current = false;
    }
  }, [updateAuthState, fetchProfileForUser]);

  // FIXED: Stable login function
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

  // FIXED: Critical initialization with single-run guard
  useEffect(() => {
    // CRITICAL: Prevent multiple initializations
    if (initializationStarted.current) {
      console.log('🔒 Initialization already started - skipping duplicate');
      return;
    }
    
    initializationStarted.current = true;
    console.log('🔒 Initializing enhanced unified auth - ONCE');
    
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
    }).finally(() => {
      if (mounted) {
        setIsInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // CRITICAL: Empty dependency array

  // FIXED: Stable computed values
  const currentAdmin = useMemo(() => 
    authState.sessionType === 'admin' ? authState.adminProfile : null, 
    [authState.sessionType, authState.adminProfile]
  );
  
  const currentExpert = useMemo(() => 
    authState.sessionType === 'expert' ? authState.expertProfile : null, 
    [authState.sessionType, authState.expertProfile]
  );

  // FIXED: Ultra-stable context value with change tracking
  const contextValue = useMemo((): EnhancedUnifiedAuthContextType => {
    const value = {
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
    };
    
    console.log('🔒 Creating stable context value');
    return value;
  }, [
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

  // FIXED: Loading state during initialization
  if (!isInitialized) {
    console.log('🔒 Auth provider initializing...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  console.log('🔒 Enhanced auth provider rendering with stable state:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading, 
    hasUser: !!authState.user, 
    sessionType: authState.sessionType
  });

  return (
    <EnhancedUnifiedAuthContext.Provider value={contextValue}>
      {children}
    </EnhancedUnifiedAuthContext.Provider>
  );
};

// FIXED: Proper memoization to prevent unnecessary re-renders
export const EnhancedUnifiedAuthProvider = React.memo(EnhancedUnifiedAuthProviderComponent);
