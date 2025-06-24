import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

type SessionType = 'user' | 'expert' | null;

export interface UnifiedAuthContextType {
  // Core state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  sessionType: SessionType;
  error: string | null;

  // Profile data
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  profile: UserProfile | ExpertProfile | null; // Current active profile

  // Role-based helpers
  role: 'user' | 'expert' | null;
  hasUserAccount: boolean;

  // Auth actions
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signup: (email: string, password: string, userData?: any) => Promise<boolean>;
  registerExpert: (email: string, password: string, expertData: Partial<ExpertProfile>) => Promise<boolean>;

  // Profile actions
  updateProfile: (updates: Partial<UserProfile | ExpertProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string | null>;

  // User-specific features (with defaults for non-users)
  addToFavorites: (expertId: number) => Promise<boolean>;
  removeFromFavorites: (expertId: number) => Promise<boolean>;
  rechargeWallet: (amount: number) => Promise<boolean>;
  addReview: (review: any, rating?: number, comment?: string) => Promise<boolean>;
  reportExpert: (report: any, reason?: string, details?: string) => Promise<boolean>;
  hasTakenServiceFrom: (id: string | number) => Promise<boolean>;
  getExpertShareLink: (expertId: string | number) => string;
  getReferralLink: () => string | null;

  // Computed properties for backward compatibility
  walletBalance: number;

  // Additional properties for compatibility
  expert: ExpertProfile | null;
  admin: any | null;
  isAuthProtected: () => boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

interface UnifiedAuthProviderProps {
  children: React.ReactNode;
}

let renderCount = 0;

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  renderCount++;
  console.log('🔒 UnifiedAuthProvider render:', renderCount);

  // Core state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionType, setSessionType] = useState<SessionType>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);

  // Loading timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('🔒 Auth loading timeout - completing initialization');
        setIsLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);

  // Fetch expert profile
  const fetchExpertProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching expert profile:', error);
        return null;
      }

      setExpertProfile(data);
      return data;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  // Determine session type based on available profiles and stored preference
  const determineSessionType = useCallback(async (user: User): Promise<SessionType> => {
    const storedType = localStorage.getItem('sessionType') as SessionType;
    console.log('🔒 Determining session type for user:', user.id, 'stored:', storedType);

    try {
      // If we have a stored preference, try to use it
      if (storedType === 'expert') {
        const expertProfile = await fetchExpertProfile(user.id);
        if (expertProfile) {
          console.log('✅ Expert profile found, using expert session');
          return 'expert';
        }
      }

      if (storedType === 'user' || !storedType) {
        const userProfile = await fetchUserProfile(user.id);
        if (userProfile) {
          console.log('✅ User profile found, using user session');
          return 'user';
        }
      }

      // Fallback: check both profiles
      const [userProfile, expertProfile] = await Promise.all([
        fetchUserProfile(user.id),
        fetchExpertProfile(user.id)
      ]);

      if (expertProfile && storedType === 'expert') return 'expert';
      if (userProfile) return 'user';
      if (expertProfile) return 'expert';

      console.log('❌ No profiles found for user');
      return null;
    } catch (error) {
      console.error('Error determining session type:', error);
      return null;
    }
  }, [fetchUserProfile, fetchExpertProfile]);

  // Improved auth state change handler
  const handleAuthStateChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('🔒 Auth state change event:', event, session?.user?.id);

    setIsLoading(true);
    setError(null);

    try {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, updating state immediately');
        
        // Force immediate state update
        setUser(session.user);
        setSession(session);
        setIsAuthenticated(true);
        
        // Determine session type
        const resolvedSessionType = await determineSessionType(session.user);
        console.log('✅ Session type determined:', resolvedSessionType);
        
        setSessionType(resolvedSessionType);
        
        // Update localStorage
        if (resolvedSessionType) {
          localStorage.setItem('sessionType', resolvedSessionType);
        }
        
        // Force component re-renders with slight delay
        setTimeout(() => {
          setIsLoading(false);
          // Dispatch custom event for components that need immediate updates
          window.dispatchEvent(new CustomEvent('auth-state-updated', { 
            detail: { 
              isAuthenticated: true, 
              sessionType: resolvedSessionType,
              user: session.user 
            } 
          }));
        }, 50);
        
      } else if (event === 'SIGNED_OUT') {
        console.log('🔒 User signed out, clearing state');
        
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setSessionType(null);
        setUserProfile(null);
        setExpertProfile(null);
        localStorage.removeItem('sessionType');
        setIsLoading(false);
        
        // Dispatch sign out event
        window.dispatchEvent(new CustomEvent('auth-state-updated', { 
          detail: { 
            isAuthenticated: false, 
            sessionType: null,
            user: null 
          } 
        }));
      } else {
        console.log('🔒 Other auth event or no session');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Auth state change failed:', error);
      setError(error instanceof Error ? error.message : 'Auth state change failed');
      setIsLoading(false);
    }
  }, [determineSessionType]);

  // Initialize auth with improved event handling
  useEffect(() => {
    console.log('🔒 Initializing auth context');

    // Set up listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔒 Initial session check:', session ? 'Session exists' : 'No session');
      if (session) {
        handleAuthStateChange('SIGNED_IN', session);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleAuthStateChange]);

  // Add custom event listener for force refresh
  useEffect(() => {
    const handleAuthRefresh = () => {
      console.log('🔄 Custom auth refresh triggered');
      
      // Force state re-evaluation
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          console.log('🔄 Re-evaluating auth state for user:', user.id);
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              handleAuthStateChange('SIGNED_IN', session);
            }
          });
        }
      });
    };
    
    window.addEventListener('auth-refresh', handleAuthRefresh);
    
    return () => {
      window.removeEventListener('auth-refresh', handleAuthRefresh);
    };
  }, [handleAuthStateChange]);

  // Auth actions
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const targetType: SessionType = options?.asExpert ? 'expert' : 'user';
      localStorage.setItem('sessionType', targetType);
      console.log('🔒 Login attempt as:', targetType);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      if (!data.session) {
        setError('Login failed - no session created');
        setIsLoading(false);
        return false;
      }

      console.log('✅ Login successful, session created');
      // The auth state change handler will handle the rest
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
        setIsLoading(false);
        return false;
      }

      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, userData?: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return false;
      }

      toast.success('Account created successfully! Please check your email for verification.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setError(error.message);
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
          address: expertData.address || '',
          city: expertData.city || '',
          state: expertData.state || '',
          country: expertData.country || '',
          specialization: expertData.specialization || '',
          experience: typeof expertData.experience === 'number' 
            ? String(expertData.experience) 
            : expertData.experience || '',
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

        await supabase.auth.signOut();
        toast.success('Expert account created successfully! Your profile is pending approval.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Expert registration error:', error);
      setError('Failed to create expert account');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Profile update functions with default implementations
  const updateProfile = useCallback(async (updates: Partial<UserProfile | ExpertProfile>): Promise<boolean> => {
    if (sessionType === 'expert' && expertProfile) {
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', expertProfile.id);
      return !error;
    } else if (sessionType === 'user' && userProfile) {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userProfile.id);
      return !error;
    }
    return false;
  }, [sessionType, userProfile, expertProfile]);

  const updateExpertProfile = useCallback(async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (expertProfile) {
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', expertProfile.id);
      return !error;
    }
    return false;
  }, [expertProfile]);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return !error;
  }, []);

  const updateProfilePicture = useCallback(async (file: File): Promise<string | null> => {
    // Default implementation - would need storage setup
    return null;
  }, []);

  // User-specific feature defaults
  const addToFavorites = useCallback(async (expertId: number): Promise<boolean> => false, []);
  const removeFromFavorites = useCallback(async (expertId: number): Promise<boolean> => false, []);
  const rechargeWallet = useCallback(async (amount: number): Promise<boolean> => false, []);
  const addReview = useCallback(async (review: any, rating?: number, comment?: string): Promise<boolean> => false, []);
  const reportExpert = useCallback(async (report: any, reason?: string, details?: string): Promise<boolean> => false, []);
  const hasTakenServiceFrom = useCallback(async (id: string | number): Promise<boolean> => false, []);
  const getExpertShareLink = useCallback((expertId: string | number): string => 
    `${window.location.origin}/experts/${expertId}`, []);
  const getReferralLink = useCallback((): string | null => null, []);

  // Auth protection placeholder
  const isAuthProtected = useCallback((): boolean => false, []);

  // Computed values
  const profile = useMemo(() => {
    if (sessionType === 'expert') return expertProfile;
    if (sessionType === 'user') return userProfile;
    return null;
  }, [sessionType, userProfile, expertProfile]);

  const role = useMemo((): 'user' | 'expert' | null => {
    if (sessionType === 'expert' && expertProfile) return 'expert';
    if (sessionType === 'user' && userProfile) return 'user';
    return null;
  }, [sessionType, userProfile, expertProfile]);

  const hasUserAccount = useMemo(() => !!userProfile, [userProfile]);
  const walletBalance = useMemo(() => 
    (userProfile as UserProfile)?.wallet_balance || 0, [userProfile]);

  const contextValue = useMemo((): UnifiedAuthContextType => ({
    // Core state
    isAuthenticated,
    isLoading,
    user,
    session,
    sessionType,
    error,

    // Profile data
    userProfile,
    expertProfile,
    profile,

    // Role-based helpers
    role,
    hasUserAccount,

    // Auth actions
    login,
    logout,
    signup,
    registerExpert,

    // Profile actions
    updateProfile,
    updateExpertProfile,
    updatePassword,
    updateProfilePicture,

    // User-specific features
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink,

    // Computed properties
    walletBalance,

    // Additional compatibility properties
    expert: expertProfile,
    admin: null,
    isAuthProtected
  }), [
    isAuthenticated, isLoading, user, session, sessionType, error,
    userProfile, expertProfile, profile, role, hasUserAccount,
    login, logout, signup, registerExpert,
    updateProfile, updateExpertProfile, updatePassword, updateProfilePicture,
    addToFavorites, removeFromFavorites, rechargeWallet, addReview, reportExpert,
    hasTakenServiceFrom, getExpertShareLink, getReferralLink, walletBalance,
    isAuthProtected
  ]);

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
