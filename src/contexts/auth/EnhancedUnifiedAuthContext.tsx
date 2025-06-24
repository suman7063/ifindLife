
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

// FIXED: Simplified initial auth state
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

const EnhancedUnifiedAuthProviderComponent: React.FC<EnhancedUnifiedAuthProviderProps> = ({ children }) => {
  // FIXED: Simplified state management
  const [authState, setAuthState] = useState(createInitialAuthState);
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);
  
  // Auth protection hooks
  const { startProtection, endProtection, isProtected } = useAuthProtection();

  // FIXED: Simplified profile fetching
  const fetchProfileForUser = useCallback(async (userId: string, type: SessionType) => {
    try {
      console.log(`🔒 Fetching ${type} profile for user:`, userId);
      
      if (type === 'user') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          console.log('🔒 User profile loaded successfully');
          return { userProfile: data };
        }
      } else if (type === 'expert') {
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          console.log('🔒 Expert profile loaded successfully');
          return { expertProfile: data };
        }
      } else if (type === 'admin') {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          console.log('🔒 Admin profile loaded successfully');
          return { adminProfile: data };
        }
      }
      
      return null;
    } catch (error) {
      console.error('🔒 Error fetching profile:', error);
      return null;
    }
  }, []);

  // FIXED: Simplified auth state handler
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('🔒 Auth state change:', event, session ? 'Has session' : 'No session');
    
    try {
      if (session?.user) {
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        
        // Set basic auth state immediately
        setAuthState(prev => ({
          ...prev,
          session,
          user: session.user,
          isAuthenticated: true,
          sessionType: storedSessionType,
          error: null,
          isLoading: true
        }));
        
        // Fetch profile if session type is known
        if (storedSessionType) {
          const profileData = await fetchProfileForUser(session.user.id, storedSessionType);
          
          setAuthState(prev => ({
            ...prev,
            ...profileData,
            isLoading: false
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      } else {
        // Clear auth state
        localStorage.removeItem('sessionType');
        setAuthState({
          ...createInitialAuthState(),
          isLoading: false
        });
      }
    } catch (error) {
      console.error('🔒 Error in auth state change:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Authentication error',
        isLoading: false
      }));
    }
  }, [fetchProfileForUser]);

  // FIXED: Simplified login function
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null, isLoading: true }));

      const targetSessionType: SessionType = options?.asExpert ? 'expert' : options?.asAdmin ? 'admin' : 'user';
      localStorage.setItem('sessionType', targetSessionType);

      console.log('🔒 Login attempt:', { email, targetSessionType });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🔒 Login error:', error);
        setAuthState(prev => ({ ...prev, error: error.message, isLoading: false }));
        return false;
      }

      console.log('🔒 Login successful');
      return true;
    } catch (error) {
      console.error('🔒 Login error:', error);
      setAuthState(prev => ({ ...prev, error: 'Login failed', isLoading: false }));
      return false;
    }
  }, []);

  // FIXED: Simplified logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔒 Logout error:', error);
        toast.error('Logout failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      localStorage.removeItem('sessionType');
      authProtection.clearAllProtections();
      
      console.log('🔒 Logout completed');
    } catch (error) {
      console.error('🔒 Logout error:', error);
      toast.error('Logout failed');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Expert registration method
  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, isLoading: false }));
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
          setAuthState(prev => ({ 
            ...prev,
            error: `Failed to create expert profile: ${profileError.message}`,
            isLoading: false 
          }));
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        await supabase.auth.signOut();
        toast.success('Expert account created successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('🔒 Expert registration error:', error);
      setAuthState(prev => ({ 
        ...prev,
        error: 'Failed to create expert account',
        isLoading: false 
      }));
      toast.error('Failed to create expert account');
      return false;
    }
  }, []);

  // FIXED: Single initialization effect
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    console.log('🔒 Initializing auth context');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
      setIsInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // FIXED: Stable computed values
  const currentAdmin = useMemo(() => 
    authState.sessionType === 'admin' ? authState.adminProfile : null, 
    [authState.sessionType, authState.adminProfile]
  );
  
  const currentExpert = useMemo(() => 
    authState.sessionType === 'expert' ? authState.expertProfile : null, 
    [authState.sessionType, authState.expertProfile]
  );

  // FIXED: Stable context value
  const contextValue = useMemo((): EnhancedUnifiedAuthContextType => ({
    // Core auth state
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    session: authState.session,
    sessionType: authState.sessionType,
    error: authState.error,

    // Profile data
    userProfile: authState.userProfile,
    expertProfile: authState.expertProfile,
    adminProfile: authState.adminProfile,
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

  // FIXED: Show simple loading during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedUnifiedAuthContext.Provider value={contextValue}>
      {children}
    </EnhancedUnifiedAuthContext.Provider>
  );
};

export const EnhancedUnifiedAuthProvider = React.memo(EnhancedUnifiedAuthProviderComponent);
