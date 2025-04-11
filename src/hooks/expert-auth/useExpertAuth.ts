
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ExpertProfile, ExpertRegistrationData } from './types';
import { toast } from 'sonner';

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
  
  // Register function
  const register = async (data: ExpertRegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if there's an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        toast.error('Please log out of your current session before registering as an expert.');
        return false;
      }
      
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            specialization: data.specialization,
            experience: data.experience,
            bio: data.bio,
            certificate_urls: data.certificate_urls || [],
            selected_services: data.selected_services
          }
        }
      });
      
      if (authError) {
        console.error('Registration auth error:', authError);
        setError(authError.message);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.session) {
        setError('Registration failed. No session created.');
        toast.error('Registration failed. No session created.');
        return false;
      }
      
      // Format data for expert profile
      const selectedServices = Array.isArray(data.selected_services) 
        ? data.selected_services.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
        : [];

      const expertExperience = typeof data.experience === 'number' 
        ? String(data.experience) 
        : (data.experience || '');

      // Create expert profile
      const expertData = {
        auth_id: authData.session.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        specialization: data.specialization || '',
        experience: expertExperience,
        bio: data.bio || '',
        certificate_urls: data.certificate_urls || [],
        selected_services: selectedServices,
        status: 'pending'
      };
      
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        console.error('Registration profile error:', profileError);
        setError(profileError.message);
        toast.error(profileError.message);
        
        // Clean up - sign out the created auth account
        await supabase.auth.signOut();
        return false;
      }
      
      // Sign out and redirect to login page
      await supabase.auth.signOut();
      window.location.href = '/expert-login?status=registered';
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
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
  
  // Update profile function with proper ID typing
  const updateProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!currentExpert?.id) {
      setError('No expert profile to update');
      return false;
    }
    
    try {
      setLoading(true);
      
      // Ensure the ID is treated as a string
      const expertId = String(currentExpert.id);
      
      const { error } = await supabase
        .from('expert_accounts')
        .update(updates)
        .eq('id', expertId);
      
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
    register,
    updateProfile,
    hasUserAccount
  };
};
