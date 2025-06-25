
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { toast } from 'sonner';

type SessionType = 'user' | 'expert' | 'admin' | null;

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
  profile: UserProfile | ExpertProfile | null;

  // Role-based helpers
  role: 'user' | 'expert' | 'admin' | null;
  hasUserAccount: boolean;

  // Auth actions
  login: (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }) => Promise<boolean>;
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

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
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

  // Restore working profile loading
  const loadUserProfile = useCallback(async (user: User, sessionType: SessionType) => {
    try {
      console.log('🔒 Loading profile for session type:', sessionType);
      
      if (sessionType === 'expert') {
        const { data: profile, error } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', user.id)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (!error && profile) {
          console.log('✅ Expert profile loaded:', profile.name);
          setExpertProfile(profile);
          return;
        }
        
        console.error('❌ Expert profile not found or not approved');
        throw new Error('Expert profile not found or not approved');
      } else if (sessionType === 'admin') {
        const { data: profile, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!error && profile) {
          console.log('✅ Admin profile loaded');
          // Handle admin profile
          return;
        }
      } else {
        // Regular user - try users table first, then profiles as fallback
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!error && profile) {
          console.log('✅ User profile loaded from users table:', profile.name);
          const userProfile: UserProfile = {
            id: profile.id,
            name: profile.name || user.email?.split('@')[0] || 'User',
            email: profile.email || user.email || '',
            phone: profile.phone,
            country: profile.country,
            city: profile.city,
            currency: profile.currency || 'USD',
            profile_picture: profile.profile_picture,
            wallet_balance: profile.wallet_balance || 0,
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: profile.updated_at || new Date().toISOString(),
            referred_by: profile.referred_by,
            referral_code: profile.referral_code || '',
            referral_link: profile.referral_link || '',
            favorite_experts: [],
            favorite_programs: [],
            enrolled_courses: [],
            reviews: [],
            reports: [],
            transactions: [],
            referrals: []
          };
          setUserProfile(userProfile);
          return;
        }
        
        // Fallback to profiles table
        const { data: fallbackProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (fallbackProfile) {
          console.log('✅ User profile loaded from profiles table:', fallbackProfile.name);
          const userProfile: UserProfile = {
            id: fallbackProfile.id,
            name: fallbackProfile.name || user.email?.split('@')[0] || 'User',
            email: fallbackProfile.email || user.email || '',
            phone: fallbackProfile.phone,
            country: fallbackProfile.country,
            city: fallbackProfile.city,
            currency: fallbackProfile.currency || 'USD',
            profile_picture: fallbackProfile.profile_picture,
            wallet_balance: fallbackProfile.wallet_balance || 0,
            created_at: fallbackProfile.created_at || new Date().toISOString(),
            updated_at: fallbackProfile.updated_at || new Date().toISOString(),
            referred_by: null,
            referral_code: '',
            referral_link: '',
            favorite_experts: [],
            favorite_programs: [],
            enrolled_courses: [],
            reviews: [],
            reports: [],
            transactions: [],
            referrals: []
          };
          setUserProfile(userProfile);
          return;
        }
        
        // Create fallback profile to prevent "U" showing
        console.log('🔒 Creating fallback user profile');
        const fallbackUserProfile: UserProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: user.user_metadata?.phone,
          country: user.user_metadata?.country,
          city: user.user_metadata?.city,
          currency: 'USD',
          profile_picture: user.user_metadata?.avatar_url,
          wallet_balance: 0,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          referred_by: null,
          referral_code: '',
          referral_link: '',
          favorite_experts: [],
          favorite_programs: [],
          enrolled_courses: [],
          reviews: [],
          reports: [],
          transactions: [],
          referrals: []
        };
        setUserProfile(fallbackUserProfile);
      }
    } catch (error) {
      console.error('❌ Profile loading error:', error);
      
      // Always create fallback to prevent UI issues
      if (sessionType === 'user' || !sessionType) {
        const fallbackProfile: UserProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: undefined,
          country: undefined,
          city: undefined,
          currency: 'USD',
          profile_picture: undefined,
          wallet_balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          referred_by: null,
          referral_code: '',
          referral_link: '',
          favorite_experts: [],
          favorite_programs: [],
          enrolled_courses: [],
          reviews: [],
          reports: [],
          transactions: [],
          referrals: []
        };
        setUserProfile(fallbackProfile);
      }
      
      // For expert auth failures, we should sign out
      if (sessionType === 'expert') {
        await supabase.auth.signOut();
        throw error;
      }
    }
  }, []);

  // Restore working auth state change handler
  const handleAuthStateChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('🔒 Auth state change:', event, session?.user?.id);
    
    setIsLoading(true);
    setError(null);

    try {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in');
        
        setUser(session.user);
        setSession(session);
        setIsAuthenticated(true);
        
        // Get session type from localStorage
        const storedSessionType = localStorage.getItem('sessionType') as SessionType;
        console.log('🔒 Session type from storage:', storedSessionType);
        
        if (storedSessionType) {
          setSessionType(storedSessionType);
          await loadUserProfile(session.user, storedSessionType);
        } else {
          // Default to user if no session type
          setSessionType('user');
          localStorage.setItem('sessionType', 'user');
          await loadUserProfile(session.user, 'user');
        }
        
      } else if (event === 'SIGNED_OUT') {
        console.log('🔒 User signed out');
        
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setSessionType(null);
        setUserProfile(null);
        setExpertProfile(null);
        localStorage.removeItem('sessionType');
      }
    } catch (error) {
      console.error('❌ Auth state change error:', error);
      setError(error instanceof Error ? error.message : 'Auth error');
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

  // Initialize auth
  useEffect(() => {
    console.log('🔒 Initializing auth context');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('🔒 Found existing session');
        handleAuthStateChange('SIGNED_IN', session);
      } else {
        console.log('🔒 No existing session');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleAuthStateChange]);

  // Restore working login
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean; asAdmin?: boolean }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine session type
      let targetSessionType: SessionType = 'user';
      if (options?.asExpert) targetSessionType = 'expert';
      if (options?.asAdmin) targetSessionType = 'admin';

      // Set session type BEFORE login
      localStorage.setItem('sessionType', targetSessionType);
      console.log('🔒 Login attempt as:', targetSessionType);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        localStorage.removeItem('sessionType');
        return false;
      }

      if (!data.session) {
        setError('Login failed - no session created');
        localStorage.removeItem('sessionType');
        return false;
      }

      console.log('✅ Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      localStorage.removeItem('sessionType');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore working logout
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      localStorage.removeItem('sessionType');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return false;
      }

      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Placeholder implementations for other methods
  const signup = useCallback(async (email: string, password: string, userData?: any): Promise<boolean> => {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, []);

  const registerExpert = useCallback(async (email: string, password: string, expertData: Partial<ExpertProfile>): Promise<boolean> => {
    // Implementation for expert registration
    return false;
  }, []);

  // Default implementations for other methods
  const updateProfile = useCallback(async (updates: Partial<UserProfile | ExpertProfile>): Promise<boolean> => false, []);
  const updateExpertProfile = useCallback(async (updates: Partial<ExpertProfile>): Promise<boolean> => false, []);
  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => false, []);
  const updateProfilePicture = useCallback(async (file: File): Promise<string | null> => null, []);
  const addToFavorites = useCallback(async (expertId: number): Promise<boolean> => false, []);
  const removeFromFavorites = useCallback(async (expertId: number): Promise<boolean> => false, []);
  const rechargeWallet = useCallback(async (amount: number): Promise<boolean> => false, []);
  const addReview = useCallback(async (review: any, rating?: number, comment?: string): Promise<boolean> => false, []);
  const reportExpert = useCallback(async (report: any, reason?: string, details?: string): Promise<boolean> => false, []);
  const hasTakenServiceFrom = useCallback(async (id: string | number): Promise<boolean> => false, []);
  const getExpertShareLink = useCallback((expertId: string | number): string => `${window.location.origin}/experts/${expertId}`, []);
  const getReferralLink = useCallback((): string | null => null, []);
  const isAuthProtected = useCallback((): boolean => false, []);

  // Computed values
  const profile = sessionType === 'expert' ? expertProfile : userProfile;
  const role = sessionType === 'expert' && expertProfile ? 'expert' : sessionType === 'user' && userProfile ? 'user' : sessionType === 'admin' ? 'admin' : null;
  const hasUserAccount = !!userProfile;
  const walletBalance = (userProfile as UserProfile)?.wallet_balance || 0;

  const contextValue: UnifiedAuthContextType = {
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
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
