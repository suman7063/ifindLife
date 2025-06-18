
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

export const EnhancedUnifiedAuthProvider: React.FC<EnhancedUnifiedAuthProviderProps> = ({ children }) => {
  // Debug hook calls
  console.log('EnhancedUnifiedAuthProvider rendering...');
  
  // Core auth state - using React.useState to be explicit
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

  // Enhanced session handler with protection awareness
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('🔒 Enhanced auth state change:', { event, hasSession: !!session, isProtected: authProtection.isProtected() });
    
    // If auth is currently protected, be more careful about state changes
    if (authProtection.isProtected() && event === 'SIGNED_OUT') {
      console.log('🔒 WARNING: Logout detected during protected operation - this may be unintended');
      const activeOps = authProtection.getActiveOperations();
      console.log('🔒 Active protected operations:', activeOps);
      
      // Don't immediately clear state if we have active operations
      if (activeOps.length > 0) {
        console.log('🔒 Delaying auth state clear due to active operations');
        return;
      }
    }

    try {
      setSession(session);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        // Determine session type and fetch appropriate profile
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        setSessionType(storedSessionType);
        
        // Fetch profile based on session type
        await fetchProfileForUser(session.user.id, storedSessionType);
      } else {
        // Clear all profile state
        setSessionType(null);
        setUserProfile(null);
        setExpertProfile(null);
        setAdminProfile(null);
      }
    } catch (error) {
      console.error('🔒 Error in auth state change handler:', error);
      setError('Authentication state error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch profile data for authenticated user
  const fetchProfileForUser = async (userId: string, type: SessionType) => {
    try {
      if (type === 'user') {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        setUserProfile(data);
      } else if (type === 'expert') {
        const { data } = await supabase
          .from('experts')
          .select('*')
          .eq('id', userId)
          .single();
        setExpertProfile(data);
      } else if (type === 'admin') {
        const { data } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();
        setAdminProfile(data);
      }
    } catch (error) {
      console.error('🔒 Error fetching profile:', error);
    }
  };

  // Enhanced login with auth protection
  const login = async (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }): Promise<boolean> => {
    const operationId = `login_${Date.now()}`;
    
    try {
      startProtection(operationId, 'booking');
      setIsLoading(true);
      setError(null);

      // Determine session type
      const targetSessionType: SessionType = options?.asExpert ? 'expert' : options?.asAdmin ? 'admin' : 'user';
      localStorage.setItem('sessionType', targetSessionType);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🔒 Login error:', error);
        setError(error.message);
        return false;
      }

      if (!data.session) {
        setError('Login failed - no session created');
        return false;
      }

      console.log('🔒 Login successful with protection');
      return true;
    } catch (error) {
      console.error('🔒 Login error:', error);
      setError('Login failed');
      return false;
    } finally {
      setIsLoading(false);
      endProtection(operationId);
    }
  };

  // Expert registration method
  const registerExpert = async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // First create the user account with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Expert registration error:', error);
        setError(error.message);
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
          console.error('Expert profile creation error:', profileError);
          setError(`Failed to create expert profile: ${profileError.message}`);
          toast.error(`Failed to create expert profile: ${profileError.message}`);
          return false;
        }

        // Sign out the user after registration
        await supabase.auth.signOut();
        
        toast.success('Expert account created successfully! Your profile is pending approval.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Expert registration error:', error);
      setError('Failed to create expert account. Please try again.');
      toast.error('Failed to create expert account. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced logout with protection check
  const logout = async (): Promise<void> => {
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
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔒 Logout error:', error);
        toast.error('Logout failed');
        return;
      }

      // Clear all state
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setSessionType(null);
      setUserProfile(null);
      setExpertProfile(null);
      setAdminProfile(null);
      
      // Clear stored session type
      localStorage.removeItem('sessionType');
      
      // Clear any remaining auth protections
      authProtection.clearAllProtections();
      
      console.log('🔒 Logout completed successfully');
    } catch (error) {
      console.error('🔒 Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔒 Initializing enhanced unified auth');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Compute current active profiles based on session type for backward compatibility
  const currentAdmin = sessionType === 'admin' ? adminProfile : null;
  const currentExpert = sessionType === 'expert' ? expertProfile : null;

  const value: EnhancedUnifiedAuthContextType = {
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
    registerExpert,

    // Auth protection
    startAuthProtection: startProtection,
    endAuthProtection: endProtection,
    isAuthProtected: isProtected
  };

  console.log('🔒 EnhancedUnifiedAuthProvider providing value:', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user, 
    sessionType 
  });

  return (
    <EnhancedUnifiedAuthContext.Provider value={value}>
      {children}
    </EnhancedUnifiedAuthContext.Provider>
  );
};
