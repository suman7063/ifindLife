
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export interface SimpleAuthContextType {
  // Core auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userType: SessionType;
  
  // Profile data
  userProfile: UserProfile | null;
  expert: ExpertProfile | null;
  
  // Auth actions
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<{ success: boolean; userType?: SessionType; error?: string }>;
  logout: () => Promise<void>;
  
  // Profile actions
  refreshProfiles: (userId?: string) => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

// Export the hook with the expected name for compatibility
export const useSimpleAuthContext = useSimpleAuth;

// Export types for compatibility
export type UserType = SessionType;
export interface SimpleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  userType: SessionType;
  userProfile: UserProfile | null;
  expert: ExpertProfile | null;
}

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [userType, setUserType] = useState<SessionType>('none');

  // Derive authentication state - CRITICAL: This must be consistent
  const isAuthenticated = Boolean(user && session);

  // Reduced logging for performance

  // Function to validate credentials against intended role
  const validateCredentialsForRole = async (userId: string, intendedRole: 'user' | 'expert'): Promise<{ isValid: boolean; actualRole?: 'user' | 'expert' | 'both' }> => {
    try {
      // Validate credentials for role
      
      // Check if user has user profile - use profiles table instead of users table for compatibility
      const { data: userProfileData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      // Check if user has expert profile
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('id, status')
        .eq('auth_id', userId)
        .single();

      const hasUserProfile = userProfileData && !userError;
      const hasExpertProfile = expertData && !expertError;

      // Profile validation results processed

      if (hasUserProfile && hasExpertProfile) {
        // User has both profiles
        if (intendedRole === 'expert' && expertData?.status === 'approved') {
          return { isValid: true, actualRole: 'both' };
        } else if (intendedRole === 'user') {
          return { isValid: true, actualRole: 'both' };
        } else {
          return { isValid: false, actualRole: 'both' };
        }
      } else if (hasExpertProfile) {
        // Only expert profile exists
        if (intendedRole === 'expert' && expertData?.status === 'approved') {
          return { isValid: true, actualRole: 'expert' };
        } else {
          return { isValid: false, actualRole: 'expert' };
        }
      } else if (hasUserProfile) {
        // Only user profile exists
        if (intendedRole === 'user') {
          return { isValid: true, actualRole: 'user' };
        } else {
          return { isValid: false, actualRole: 'user' };
        }
      } else {
        // No profiles exist - still allow login but will create profiles later
        // No existing profiles found, allowing login to proceed
        return { isValid: true, actualRole: intendedRole === 'expert' ? 'expert' : 'user' };
      }
    } catch (error) {
      console.error('❌ Error validating credentials:', error);
      // Allow login to proceed even if validation fails - profiles will be handled later
      return { isValid: true, actualRole: intendedRole === 'expert' ? 'expert' : 'user' };
    }
  };

  // Improved profile loading function
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Loading user profile
      
      // Try both tables to ensure compatibility
      let profile = null;
      let error = null;
      
      // First try the users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (usersData && !usersError) {
        profile = usersData;
      } else {
        // Fallback to profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profilesData && !profilesError) {
          profile = profilesData;
        } else {
          error = profilesError || usersError;
        }
      }

      if (error && !profile) {
        setUserProfile(null);
        return null;
      }

      // User profile loaded successfully
      
      // Transform database response to match UserProfile interface
      const transformedProfile: UserProfile = {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        country: profile.country || '',
        city: profile.city || '',
        currency: profile.currency || 'USD',
        profile_picture: profile.profile_picture || '',
        referral_code: profile.referral_code || '',
        referral_link: profile.referral_link || '',
        referred_by: profile.referred_by || '',
        wallet_balance: profile.wallet_balance || 0,
        created_at: profile.created_at,
        updated_at: profile.updated_at || profile.created_at,
        favorite_experts: [],
        favorite_programs: [],
        enrolled_courses: [],
        reviews: [],
        recent_activities: [],
        upcoming_appointments: [],
        transactions: [],
        reports: [],
        referrals: []
      };
      
      setUserProfile(transformedProfile);
      return transformedProfile;
    } catch (error) {
      console.error('❌ User profile fetch failed:', error);
      setUserProfile(null);
      return null;
    }
  };

  const loadExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
    try {
      console.log('🎯 Loading expert profile for:', userId);
      
      const { data: expertData, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.log('ℹ️ No expert profile found:', error.message);
        setExpert(null);
        return null;
      }

      console.log('✅ Expert profile loaded:', expertData);
      
      // Transform the data to match ExpertProfile interface with proper defaults
      const transformedExpert: ExpertProfile = {
        id: expertData.id,
        auth_id: expertData.auth_id || userId,
        name: expertData.name || '',
        email: expertData.email || '',
        phone: expertData.phone || '',
        bio: expertData.bio || '',
        specialties: expertData.specialization ? [expertData.specialization] : [],
        experience_years: expertData.experience ? parseInt(expertData.experience) || 0 : 0,
        hourly_rate: 0,
        status: (expertData.status as 'pending' | 'approved' | 'disapproved') || 'pending',
        profile_picture: expertData.profile_picture || '',
        profilePicture: expertData.profile_picture || '',
        created_at: expertData.created_at,
        updated_at: expertData.created_at,
        address: expertData.address || '',
        city: expertData.city || '',
        state: expertData.state || '',
        country: expertData.country || '',
        specialization: expertData.specialization || '',
        experience: expertData.experience || '',
        certificate_urls: expertData.certificate_urls || [],
        selected_services: expertData.selected_services || [],
        average_rating: expertData.average_rating || 0,
        reviews_count: expertData.reviews_count || 0,
        verified: expertData.verified || false
      };
      
      setExpert(transformedExpert);
      return transformedExpert;
    } catch (error) {
      console.error('❌ Expert profile fetch failed:', error);
      return null;
    }
  };

  const refreshProfiles = async (userId?: string): Promise<void> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      console.warn('⚠️ No user ID to refresh profiles', { userId, hasUser: !!user });
      return;
    }

    console.log('🔄 Refreshing profiles for user:', targetUserId);
    
    try {
      // Load both profiles in parallel
      const [userProfileData, expertData] = await Promise.all([
        loadUserProfile(targetUserId),
        loadExpertProfile(targetUserId)
      ]);

      // Get login preferences with explicit priority
      const sessionType = localStorage.getItem('sessionType');
      const preferredRole = localStorage.getItem('preferredRole');
      const loginPreference = sessionType || preferredRole;
      
      console.log('📋 Profile refresh results:', {
        hasUserProfile: !!userProfileData,
        hasExpertProfile: !!expertData,
        expertStatus: expertData?.status,
        sessionType,
        preferredRole,
        loginPreference
      });
      
      // Determine user type based on loaded profiles and preferences
      let newUserType: SessionType = 'none';
      
      if (userProfileData && expertData) {
        // User has both profiles - STRICTLY honor the login preference
        if (loginPreference === 'expert' && expertData.status === 'approved') {
          console.log('✅ EXPERT LOGIN: User has both profiles but logged in as expert - honoring expert preference');
          newUserType = 'expert';
        } else if (loginPreference === 'user') {
          console.log('✅ USER LOGIN: User has both profiles and logged in as user - honoring user preference');
          newUserType = 'user';
        } else if (expertData.status === 'approved') {
          // If no clear preference but expert is approved, default to expert
          console.log('ℹ️ No clear preference but expert approved - defaulting to expert');
          newUserType = 'expert';
        } else {
          // Default to user if expert not approved
          console.log('ℹ️ Expert not approved - defaulting to user');
          newUserType = 'user';
        }
      } else if (expertData && expertData.status === 'approved') {
        // Only expert profile exists and is approved
        console.log('✅ EXPERT ONLY: Only expert profile exists and is approved');
        newUserType = 'expert';
      } else if (userProfileData) {
        // Only user profile exists
        console.log('✅ USER ONLY: Only user profile exists');
        newUserType = 'user';
      } else {
        // No profiles found - this is an error state
        console.warn('⚠️ PROFILE ERROR: No valid profiles found for authenticated user');
        newUserType = 'none';
      }
      
      console.log('✅ Profiles refreshed. Final user type:', newUserType);
      setUserType(newUserType);
      
    } catch (error) {
      console.error('❌ Profile refresh failed:', error);
      setUserType('none');
    }
  };

  // Auth actions
  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<{ success: boolean; userType?: SessionType; error?: string }> => {
    try {
      console.log('🔐 SimpleAuthContext: Login attempt for:', email, 'as expert:', options?.asExpert);
      
      // First attempt to sign in to get the user ID
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ SimpleAuthContext: Login error:', error.message);
        
        // Check for common authentication errors and provide user-friendly messages
        if (error.message === 'Invalid login credentials') {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        } else if (error.message === 'Email not confirmed') {
          return { success: false, error: 'Please verify your email address before logging in. Check your inbox for the verification link.' };
        } else if (error.message.includes('signup confirmation')) {
          return { success: false, error: 'Please verify your email address before logging in. Check your inbox for the verification link.' };
        }
        
        return { success: false, error: error.message };
      }

      if (!data.user || !data.session) {
        console.error('❌ SimpleAuthContext: No user or session returned');
        return { success: false, error: 'Authentication failed' };
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        console.error('❌ SimpleAuthContext: Email not verified');
        // Sign out the user since they haven't verified their email
        await supabase.auth.signOut();
        return { success: false, error: 'Please verify your email address before logging in. Check your inbox for the verification link.' };
      }

      // Now validate the credentials against the intended role
      const intendedRole = options?.asExpert ? 'expert' : 'user';
      const validation = await validateCredentialsForRole(data.user.id, intendedRole);
      
      if (!validation.isValid) {
        console.error('❌ Credential validation failed:', {
          intendedRole,
          actualRole: validation.actualRole
        });
        
        // Sign out the user since they used wrong credentials
        await supabase.auth.signOut();
        
        let errorMessage = 'Invalid credentials for this login type.';
        if (validation.actualRole === 'expert' && intendedRole === 'user') {
          errorMessage = 'These are expert credentials. Please use the expert login.';
        } else if (validation.actualRole === 'user' && intendedRole === 'expert') {
          errorMessage = 'These are user credentials. Please use the user login.';
        } else if (validation.actualRole === 'expert' && intendedRole === 'expert') {
          errorMessage = 'Your expert account is pending admin approval.';
        }
        
        return { success: false, error: errorMessage };
      }

      // Set session type preference after successful validation
      if (options?.asExpert) {
        console.log('🎯 Setting expert login preference');
        localStorage.setItem('sessionType', 'expert');
        localStorage.setItem('preferredRole', 'expert');
      } else {
        console.log('👤 Setting user login preference');
        localStorage.setItem('sessionType', 'user');
        localStorage.setItem('preferredRole', 'user');
      }

      console.log('✅ SimpleAuthContext: Login successful and validated');
      
      // Return success with determined user type
      return { 
        success: true, 
        userType: intendedRole === 'expert' ? 'expert' : 'user'
      };

    } catch (error) {
      console.error('❌ SimpleAuthContext: Login exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    console.log('🚪 Starting logout...');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }

      // Clear all state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setExpert(null);
      setUserType('none');
      
      // Clear local storage
      localStorage.removeItem('sessionType');
      localStorage.removeItem('preferredRole');
      
      console.log('✅ Logout completed');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Auth initialization and state management
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      console.log('🚀 Auth: Starting initialization...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.warn('⚠️ Auth: Session check error:', error);
        } else if (session) {
          console.log('✅ Auth: Initial session found:', { userId: session.user.id, email: session.user.email });
          setSession(session);
          setUser(session.user);
          // Profiles will be loaded by the auth state change listener
        } else {
          console.log('ℹ️ Auth: No initial session found');
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
      } catch (error) {
        console.error('❌ Auth: Initialization failed:', error);
      } finally {
        if (mounted) {
          console.log('✅ Auth: Initial check complete');
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth: State change event:', event, session ? { userId: session.user.id } : 'no session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User authenticated, loading profiles...');
          // Immediately refresh profiles with the user ID to prevent race conditions
          setTimeout(async () => {
            if (mounted) {
              await refreshProfiles(session.user.id);
            }
          }, 100); // Reduced delay to fix race condition in expert login
        } else {
          // Clear profiles when user is not authenticated
          console.log('🚫 User logged out, clearing profiles');
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
      subscription.unsubscribe();
    };
  }, []);

  // CRITICAL: Make sure we return all required values consistently
  // Memoize context value to prevent unnecessary re-renders
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
    refreshProfiles
  }), [isAuthenticated, isLoading, user, session, userType, userProfile, expert, login, logout, refreshProfiles]);

  // Reduced logging in production
  if (process.env.NODE_ENV === 'development') {
    console.log('📡 SimpleAuthContext: Context value updated');
  }

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
