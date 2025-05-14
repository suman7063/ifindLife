
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole, UpdateProfileParams } from '@/contexts/auth/types';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/supabase/user';

export const useAuthFunctions = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Function to initialize the auth state
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      
      if (!session) {
        setAuthState({
          ...initialAuthState,
          loading: false,
          isLoading: false
        });
        return;
      }
      
      // Get user data from the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError.message);
      }
      
      // Get expert data from the database
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle();
        
      if (expertError && expertError.code !== 'PGRST116') {
        console.error('Error fetching expert data:', expertError.message);
      }
      
      // Determine user role
      let role: UserRole = null;
      if (userData) {
        role = 'user';
      }
      if (expertData) {
        role = 'expert';
      }
      
      // Create a full user profile with default values for required fields
      const profile: UserProfile = userData ? {
        id: userData.id,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        city: userData.city || '',
        currency: userData.currency || 'USD',
        profile_picture: userData.profile_picture || '',
        wallet_balance: userData.wallet_balance || 0,
        created_at: userData.created_at || '',
        referred_by: userData.referred_by || null,
        referral_code: userData.referral_code || '',
        referral_link: userData.referral_link || '',
        favorite_experts: userData.favorite_experts || [],
        favorite_programs: userData.favorite_programs || [],
        enrolled_courses: userData.enrolled_courses || [],
        reviews: userData.reviews || [],
        reports: userData.reports || [],
        transactions: userData.transactions || [],
        referrals: userData.referrals || []
      } : null;
      
      // Update auth state
      setAuthState({
        user: {
          id: session.user.id,
          email: session.user.email,
          role
        },
        session,
        profile,
        userProfile: profile,
        expertProfile: expertData,
        loading: false,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        role,
        sessionType: userData && expertData ? 'dual' : userData ? 'user' : expertData ? 'expert' : 'none',
        walletBalance: profile?.wallet_balance || 0
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        ...initialAuthState,
        loading: false,
        isLoading: false,
        error: error as Error
      });
    }
  }, []);
  
  return {
    authState,
    setAuthState,
    initializeAuth
  };
};
