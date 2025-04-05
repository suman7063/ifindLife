
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertAuthState, UseExpertAuthReturn } from './types';
import { useExpertAuthentication } from './useExpertAuthentication';
import { useExpertProfile } from './useExpertProfile';
import { toast } from 'sonner';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [authState, setAuthState] = useState<ExpertAuthState>({
    currentExpert: null,
    isLoading: true,
    authInitialized: false,
    isAuthenticated: false,
  });
  
  const fetchExpertProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();
        
      if (error || !data) {
        console.error('Error fetching expert profile:', error);
        return null;
      }
      
      return data as ExpertProfile;
    } catch (error) {
      console.error('Error in fetchExpertProfile:', error);
      return null;
    }
  }, []);

  const { 
    login, 
    logout, 
    register, 
    hasUserAccount 
  } = useExpertAuthentication(
    (expert) => setAuthState(prev => ({ ...prev, currentExpert: expert, isAuthenticated: !!expert })),
    (loading) => setAuthState(prev => ({ ...prev, isLoading: loading })),
    fetchExpertProfile
  );
  
  const { 
    updateProfile, 
    updateAvailability, 
    updateServices 
  } = useExpertProfile(
    authState.currentExpert,
    (expert) => setAuthState(prev => ({ ...prev, currentExpert: expert }))
  );

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          setAuthState({
            currentExpert: null,
            isLoading: false,
            authInitialized: true,
            isAuthenticated: false,
          });
          return;
        }
        
        // Fetch expert profile
        const expertProfile = await fetchExpertProfile(data.session.user.id);
        
        setAuthState({
          currentExpert: expertProfile,
          isLoading: false,
          authInitialized: true,
          isAuthenticated: !!expertProfile,
        });
      } catch (error) {
        console.error('Error initializing expert auth:', error);
        setAuthState({
          currentExpert: null,
          isLoading: false,
          authInitialized: true,
          isAuthenticated: false,
        });
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const expertProfile = await fetchExpertProfile(session.user.id);
          setAuthState({
            currentExpert: expertProfile,
            isLoading: false,
            authInitialized: true,
            isAuthenticated: !!expertProfile,
          });
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            currentExpert: null,
            isLoading: false,
            authInitialized: true,
            isAuthenticated: false,
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchExpertProfile]);

  return {
    ...authState,
    login,
    logout,
    register,
    hasUserAccount,
    updateProfile,
    updateAvailability,
    updateServices,
  };
};
