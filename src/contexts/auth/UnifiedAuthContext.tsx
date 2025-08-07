import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export interface UnifiedAuthContextType {
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

const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

interface UnifiedAuthProviderProps {
  children: ReactNode;
}

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [userType, setUserType] = useState<SessionType>('none');

  // Derive authentication state - CRITICAL: This must be consistent
  const isAuthenticated = Boolean(user && session);

  // Function to validate credentials against intended role
  const validateCredentialsForRole = async (userId: string, intendedRole: 'user' | 'expert'): Promise<{ isValid: boolean; actualRole?: 'user' | 'expert' | 'both' }> => {
    try {
      // Check if user has user profile
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
        return { isValid: true, actualRole: intendedRole === 'expert' ? 'expert' : 'user' };
      }
    } catch (error) {
      console.error('Error validating credentials:', error);
      // Allow login to proceed even if validation fails - profiles will be handled later
      return { isValid: true, actualRole: intendedRole === 'expert' ? 'expert' : 'user' };
    }
  };

  // Improved profile loading function
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
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
      console.error('User profile fetch failed:', error);
      setUserProfile(null);
      return null;
    }
  };

  const loadExpertProfile = async (userId: string): Promise<ExpertProfile | null> => {
    try {
      const { data: expertData, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        setExpert(null);
        return null;
      }
      
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
      console.error('Expert profile fetch failed:', error);
      return null;
    }
  };

  const refreshProfiles = async (userId?: string): Promise<void> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      return;
    }
    
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
      
      // Determine user type based on loaded profiles and preferences
      let newUserType: SessionType = 'none';
      
      if (userProfileData && expertData) {
        // User has both profiles - STRICTLY honor the login preference
        if (loginPreference === 'expert' && expertData.status === 'approved') {
          newUserType = 'expert';
        } else if (loginPreference === 'user') {
          newUserType = 'user';
        } else if (expertData.status === 'approved') {
          // If no clear preference but expert is approved, default to expert
          newUserType = 'expert';
        } else {
          // Default to user if expert not approved
          newUserType = 'user';
        }
      } else if (expertData && expertData.status === 'approved') {
        // Only expert profile exists and is approved
        newUserType = 'expert';
      } else if (userProfileData) {
        // Only user profile exists
        newUserType = 'user';
      } else {
        // No profiles found - this is an error state
        newUserType = 'none';
      }
      
      setUserType(newUserType);
      
    } catch (error) {
      console.error('Profile refresh failed:', error);
      setUserType('none');
    }
  };

  // Auth actions
  const login = async (email: string, password: string, options?: { asExpert?: boolean }): Promise<{ success: boolean; userType?: SessionType; error?: string }> => {
    try {
      // First attempt to sign in to get the user ID
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
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
        return { success: false, error: 'Authentication failed' };
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        // Sign out the user since they haven't verified their email
        await supabase.auth.signOut();
        return { success: false, error: 'Please verify your email address before logging in. Check your inbox for the verification link.' };
      }

      // Now validate the credentials against the intended role
      const intendedRole = options?.asExpert ? 'expert' : 'user';
      const validation = await validateCredentialsForRole(data.user.id, intendedRole);
      
      if (!validation.isValid) {
        // Sign out the user since they used wrong credentials
        await supabase.auth.signOut();
        
        let errorMessage = 'Invalid credentials for this login type.';
        if (validation.actualRole === 'expert' && intendedRole === 'user') {
          errorMessage = 'These are expert credentials. Please use the expert login.';
        } else if (validation.actualRole === 'user' && intendedRole === 'expert') {
          errorMessage = 'These are user credentials. Please use the user login.';
        } else if (validation.actualRole === 'expert' && intendedRole === 'expert') {
          errorMessage = 'Your expert account is not approved yet.';
        }
        
        return { success: false, error: errorMessage };
      }

      // Set session type preference after successful validation
      if (options?.asExpert) {
        localStorage.setItem('sessionType', 'expert');
        localStorage.setItem('preferredRole', 'expert');
      } else {
        localStorage.setItem('sessionType', 'user');
        localStorage.setItem('preferredRole', 'user');
      }
      
      // Return success with determined user type
      return { 
        success: true, 
        userType: intendedRole === 'expert' ? 'expert' : 'user'
      };

    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
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
      
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setSession(session);
          // Refresh profiles after successful sign in
          await refreshProfiles(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setExpert(null);
          setUserType('none');
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session) {
        setUser(session.user);
        setSession(session);
        refreshProfiles(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
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
  }), [isAuthenticated, isLoading, user, session, userType, userProfile, expert]);

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};