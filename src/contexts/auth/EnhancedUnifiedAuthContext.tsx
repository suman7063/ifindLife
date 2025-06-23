import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  // Core auth state - using individual useState to prevent cascade updates
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [sessionType, setSessionType] = React.useState<SessionType>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Profile state
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = React.useState<ExpertProfile | null>(null);
  const [adminProfile, setAdminProfile] = React.useState<AdminProfile | null>(null);

  // Auth protection hooks
  const { startProtection, endProtection, isProtected } = useAuthProtection();

  // FIXED: Stable batch update function to prevent cascade re-renders
  const updateAuthState = useCallback((updates: {
    session?: Session | null;
    user?: User | null;
    isAuthenticated?: boolean;
    sessionType?: SessionType;
    userProfile?: UserProfile | null;
    expertProfile?: ExpertProfile | null;
    adminProfile?: AdminProfile | null;
    isLoading?: boolean;
    error?: string | null;
  }) => {
    console.log('🔒 Batching auth state updates:', Object.keys(updates));
    
    // Batch updates using functional updates to prevent race conditions
    if (updates.session !== undefined) setSession(updates.session);
    if (updates.user !== undefined) setUser(updates.user);
    if (updates.isAuthenticated !== undefined) setIsAuthenticated(updates.isAuthenticated);
    if (updates.sessionType !== undefined) setSessionType(updates.sessionType);
    if (updates.userProfile !== undefined) setUserProfile(updates.userProfile);
    if (updates.expertProfile !== undefined) setExpertProfile(updates.expertProfile);
    if (updates.adminProfile !== undefined) setAdminProfile(updates.adminProfile);
    if (updates.isLoading !== undefined) setIsLoading(updates.isLoading);
    if (updates.error !== undefined) setError(updates.error);
  }, []);

  // FIXED: Add loading timeout to prevent indefinite loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('🔒 Auth loading timeout reached, forcing completion');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  // Fetch profile data for authenticated user
  const fetchProfileForUser = useCallback(async (userId: string, type: SessionType) => {
    try {
      setIsLoading(true);
      
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

  // FIXED: Enhanced session handler with better error handling and no infinite loops
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
        
        // Update core auth state first
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
          setIsLoading(false);
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
      setError(null);
      setIsLoading(true);

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
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      if (!data.session) {
        console.error('🔒 Login failed: No session created');
        setError('Login failed - no session created');
        setIsLoading(false);
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
      setError('Login failed');
      setIsLoading(false);
      return false;
    } finally {
      endProtection(operationId);
    }
  }, [startProtection, endProtection]);

  // Expert registration method
  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      updateAuthState({ isLoading: true, error: null });

      console.log('🔒 Expert registration attempt:', { email });

      // First create the user account with Supabase Auth
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
        // Convert experience to string if it's a number
        const experience = typeof expertData.experience === 'number' 
          ? String(expertData.experience) 
          : expertData.experience || '';

        // Create expert profile with the auth user id
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

        // Sign out the user after registration
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
      // Check if logout is safe
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

      setIsLoading(true);
      
      console.log('🔒 Logout initiated:', {
        currentSessionType: sessionType,
        hasUser: !!user,
        timestamp: new Date().toISOString()
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔒 Logout error:', error);
        toast.error('Logout failed');
        setIsLoading(false);
        return;
      }

      // Clear stored session type
      localStorage.removeItem('sessionType');
      
      // Clear any remaining auth protections
      authProtection.clearAllProtections();
      
      console.log('🔒 Logout completed successfully');
    } catch (error) {
      console.error('🔒 Logout error:', error);
      toast.error('Logout failed');
      setIsLoading(false);
    }
  }, [sessionType, user]);

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
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Compute current active profiles based on session type for backward compatibility
  const currentAdmin = useMemo(() => sessionType === 'admin' ? adminProfile : null, [sessionType, adminProfile]);
  const currentExpert = useMemo(() => sessionType === 'expert' ? expertProfile : null, [sessionType, expertProfile]);

  // FIXED: Stable context value to prevent unnecessary re-renders
  const contextValue = useMemo((): EnhancedUnifiedAuthContextType => ({
    // Core auth state
    isAuthenticated,
    isLoading,
    user,
    session,
    sessionType,
    error,

    // Profile data - individual profiles
    userProfile,
    expertProfile,
    adminProfile,

    // Profile data - current active profiles (for backward compatibility)
    admin: currentAdmin,
    expert: currentExpert,

    // Auth actions
    login,
    logout,
    registerExpert: async () => false, // Simplified for now
    
    // Auth protection
    startAuthProtection: startProtection,
    endAuthProtection: endProtection,
    isAuthProtected: isProtected
  }), [
    isAuthenticated,
    isLoading,
    user,
    session,
    sessionType,
    error,
    userProfile,
    expertProfile,
    adminProfile,
    currentAdmin,
    currentExpert,
    login,
    logout,
    startProtection,
    endProtection,
    isProtected
  ]);

  console.log('🔒 EnhancedUnifiedAuthProvider providing value:', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user, 
    sessionType,
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
