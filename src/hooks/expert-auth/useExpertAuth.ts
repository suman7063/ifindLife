
import { useState, useEffect } from 'react';
import type { UseExpertAuthReturn, ExpertProfile } from './types';
import { supabase } from '@/lib/supabase';

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Expert auth state change:', event);
        
        // Always update auth state
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_IN' && session) {
          await fetchExpertProfile(session.user.id);
        }
        
        if (event === 'SIGNED_OUT') {
          setCurrentExpert(null);
        }
        
        setAuthInitialized(true);
      }
    );

    // Initial auth check
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await fetchExpertProfile(session.user.id);
        setIsAuthenticated(true);
      } else {
        setCurrentExpert(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking expert auth:', error);
      setCurrentExpert(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setAuthInitialized(true);
    }
  };

  const fetchExpertProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setCurrentExpert(data);
      } else {
        setCurrentExpert(null);
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      setCurrentExpert(null);
    }
  };

  // Function to check if a user exists with the given email
  const hasUserAccount = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user account:', error);
      return false;
    }
  };

  const login = (email: string, password: string) => {
    // Implement login
    return Promise.resolve(false);
  };

  const logout = async () => {
    // Implement logout
    return Promise.resolve(true);
  };

  const register = () => {
    // Implement register
    return Promise.resolve(false);
  };

  const updateProfile = () => {
    // Implement update profile
    return Promise.resolve(false);
  };

  // Provide the required interface
  return {
    expert: currentExpert,
    currentExpert,
    isAuthenticated,
    loading: isLoading,
    authInitialized,
    isLoading,
    hasUserAccount,
    login,
    logout: async () => {
      const result = await logout();
      return result;
    },
    register,
    updateProfile
  };
};
