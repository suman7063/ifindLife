
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from './types';

export const useExpertAuth = () => {
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        if (!session) {
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        setUser(session.user);
        
        // Fetch expert profile
        const { data: expertData, error: expertError } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
        
        if (expertError && expertError.code !== 'PGRST116') {
          console.error('Error fetching expert profile:', expertError);
          setError(expertError.message);
        }
        
        if (expertData) {
          setCurrentExpert(expertData as ExpertProfile);
        }
      } catch (err) {
        console.error('Error initializing expert auth:', err);
        setError('Error initializing authentication');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    initAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: expertData } = await supabase
            .from('expert_accounts')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
          
          setCurrentExpert(expertData as ExpertProfile);
        } else {
          setCurrentExpert(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        return false;
      }
      
      if (!data.session) {
        setError('Login failed: No session created');
        return false;
      }
      
      setUser(data.user);
      
      // Check if the user has an expert profile
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      if (expertError && expertError.code !== 'PGRST116') {
        console.error('Error checking expert profile:', expertError);
        setError('Error checking expert profile');
        return false;
      }
      
      if (!expertData) {
        setError('No expert profile found for this account');
        await supabase.auth.signOut();
        return false;
      }
      
      setCurrentExpert(expertData as ExpertProfile);
      return true;
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        setError(error.message);
        return false;
      }
      
      setUser(null);
      setCurrentExpert(null);
      return true;
    } catch (err) {
      console.error('Error during logout:', err);
      setError('An error occurred during logout');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile function
  const updateProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!currentExpert?.id) {
      setError('No expert profile to update');
      return false;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', currentExpert.id);
      
      if (error) {
        console.error('Profile update error:', error);
        setError(error.message);
        return false;
      }
      
      // Update local state
      setCurrentExpert(prev => {
        if (!prev) return null;
        return { ...prev, ...updates };
      });
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating profile');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has a user account (modified to accept no parameters)
  const hasUserAccount = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .limit(1);
      
      if (error) {
        console.error('Error checking user account:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking user account:', err);
      return false;
    }
  };
  
  return {
    currentExpert,
    isAuthenticated: !!currentExpert,
    loading,
    isLoading: loading, // Alias for backward compatibility
    error,
    initialized,
    authInitialized: initialized, // Alias for backward compatibility
    user,
    login,
    logout,
    updateProfile,
    hasUserAccount
  };
};
