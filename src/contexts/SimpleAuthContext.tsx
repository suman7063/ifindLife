
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

interface SimpleAuthContextType {
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
  login: (email: string, password: string, options?: { asExpert?: boolean }) => Promise<{ success: boolean; userType?: SessionType }>;
  logout: () => Promise<void>;
  
  // Profile actions
  refreshProfiles: () => Promise<void>;
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

  console.log('🔄 SimpleAuthContext: Current detailed state:', {
    user: user ? { id: user.id, email: user.email } : null,
    session: session ? 'exists' : null,
    isAuthenticated,
    userType,
    isLoading,
    userProfile: userProfile ? { id: userProfile.id, name: userProfile.name } : null,
    expert: expert ? { id: expert.id, name: expert.name } : null
  });

  // Improved profile loading function
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('📊 Loading user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ User profile error:', error);
        return null;
      }

      console.log('✅ User profile loaded:', profile);
      
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
        updated_at: profile.created_at, // Use created_at as fallback for updated_at
        // Set default values for required properties
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
        hourly_rate: 0, // Default since not in expert_accounts table
        status: (expertData.status as 'pending' | 'approved' | 'disapproved') || 'pending',
        profile_picture: expertData.profile_picture || '',
        profilePicture: expertData.profile_picture || '',
        created_at: expertData.created_at,
        updated_at: expertData.created_at, // Fallback to created_at
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

  const refreshProfiles = async (): Promise<void> => {
    if (!user?.id) {
      console.warn('⚠️ No user ID to refresh profiles');
      return;
    }

    console.log('🔄 Refreshing profiles for user:', user.id);
    
    try {
      // Load both profiles in parallel
      const [userProfileData, expertData] = await Promise.all([
        loadUserProfile(user.id),
        loadExpertProfile(user.id)
      ]);

      // Get login preferences
      const preferredRole = localStorage.getItem('sessionType') || localStorage.getItem('preferredRole');
      
      console.log('📋 Profile refresh results:', {
        hasUserProfile: !!userProfileData,
        hasExpertProfile: !!expertData,
        expertStatus: expertData?.status,
        preferredRole
      });
      
      // Determine user type based on loaded profiles and preferences
      let newUserType: SessionType = 'none';
      
      if (userProfileData && expertData) {
        // User has both profiles - prioritize expert login preference
        if (preferredRole === 'expert' && expertData.status === 'approved') {
          console.log('✅ User logged in as expert and has approved expert profile');
          newUserType = 'expert';
        } else if (expertData.status === 'approved') {
          // Expert profile exists and is approved, but user didn't explicitly choose expert
          console.log('ℹ️ User has approved expert profile but logged in as user');
          newUserType = 'user';
        } else {
          // Expert profile exists but not approved, default to user
          console.log('ℹ️ Expert profile not approved, defaulting to user');
          newUserType = 'user';
        }
      } else if (expertData && expertData.status === 'approved') {
        // Only expert profile exists and is approved
        console.log('✅ Only expert profile exists and is approved');
        newUserType = 'expert';
      } else if (userProfileData) {
        // Only user profile exists
        console.log('✅ Only user profile exists');
        newUserType = 'user';
      } else {
        // No profiles found or expert profile not approved
        console.log('⚠️ No valid profiles found');
        newUserType = 'none';
      }
      
      console.log('✅ Profiles refreshed. Final user type:', newUserType);
      setUserType(newUserType);
      
    } catch (error) {
      console.error('❌ Profile refresh failed:', error);
    }
  };

  // Auth actions
  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<{ success: boolean; userType?: SessionType }> => {
    try {
      console.log('🔐 SimpleAuthContext: Login attempt for:', email, 'as expert:', options?.asExpert);
      
      // Set session type preference before login - THIS IS CRITICAL
      if (options?.asExpert) {
        console.log('🎯 Setting expert login preference');
        localStorage.setItem('sessionType', 'expert');
        localStorage.setItem('preferredRole', 'expert');
      } else {
        console.log('👤 Setting user login preference');
        localStorage.setItem('sessionType', 'user');
        localStorage.setItem('preferredRole', 'user');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ SimpleAuthContext: Login error:', error.message);
        return { success: false };
      }

      if (data.user && data.session) {
        console.log('✅ SimpleAuthContext: Login successful, profiles will load via auth listener');
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error('❌ SimpleAuthContext: Login exception:', error);
      return { success: false };
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
          // Small delay to ensure user state is set
          setTimeout(async () => {
            if (mounted) {
              await refreshProfiles();
            }
          }, 100);
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
  const contextValue: SimpleAuthContextType = {
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
  };

  console.log('📡 SimpleAuthContext: Providing context value:', {
    isAuthenticated: contextValue.isAuthenticated,
    isLoading: contextValue.isLoading,
    userType: contextValue.userType,
    hasUser: !!contextValue.user,
    hasUserProfile: !!contextValue.userProfile,
    hasExpert: !!contextValue.expert,
    userEmail: contextValue.user?.email
  });

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
