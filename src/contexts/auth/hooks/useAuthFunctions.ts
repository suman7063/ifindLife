
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole } from '@/contexts/auth/types';
import { toast } from '@/hooks/use-toast';

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
        .single();
        
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError.message);
      }
      
      // Get expert data from the database
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();
        
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
      
      // Update auth state
      setAuthState({
        user: {
          id: session.user.id,
          email: session.user.email,
          role
        },
        session,
        profile: userData,
        userProfile: userData,
        expertProfile: expertData,
        loading: false,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        role,
        sessionType: userData && expertData ? 'dual' : userData ? 'user' : expertData ? 'expert' : 'none',
        walletBalance: userData?.wallet_balance || 0
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
