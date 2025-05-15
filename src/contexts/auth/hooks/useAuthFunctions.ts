
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole } from '../types';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/database/unified';

export const useAuthFunctions = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  
  // Function to update password
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Error updating password:', error.message);
        toast({
          title: 'Error',
          description: `Failed to update password: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Success',
        description: 'Your password has been updated successfully',
      });
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: 'Failed to update password',
        variant: 'destructive',
      });
      return false;
    }
  };
  
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
      
      // Create a standardized user profile with appropriate defaults
      const profile = userData ? {
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        city: userData.city || '',
        profile_picture: userData.profile_picture || '',
        wallet_balance: userData.wallet_balance || 0,
        currency: userData.currency || 'USD',
        created_at: userData.created_at || '',
        referred_by: userData.referred_by || null,
        referral_code: userData.referral_code || '',
        referral_link: userData.referral_link || '',
        favorite_experts: userData.favorite_experts || [],
        favorite_programs: userData.favorite_programs?.map(id => String(id)) || [],
        enrolled_courses: userData.enrolled_courses || [],
        reviews: userData.reviews || [],
        reports: userData.reports || [],
        transactions: userData.transactions || [],
        referrals: userData.referrals || []
      } as UserProfile : null;
      
      // Update auth state with all fetched data
      setAuthState({
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
          role
        } : null,
        session,
        profile,
        userProfile: profile,
        expertProfile: expertData || null,
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
    initializeAuth,
    updatePassword
  };
};
