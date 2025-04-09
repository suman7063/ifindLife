
import React, { ReactNode, useState, useEffect } from 'react';
import { ExpertAuthContext } from './ExpertAuthContext';
import { ExpertProfile } from '@/hooks/expert-auth/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ExpertAuthProviderProps {
  children: ReactNode;
}

export const ExpertAuthProvider: React.FC<ExpertAuthProviderProps> = ({ children }) => {
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting expert session:', sessionError);
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
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Expert login error:', error);
        toast.error('Login failed: ' + error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error('Login failed: No user data returned');
        return false;
      }
      
      // Check if there's an expert profile for this user
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      if (expertError) {
        console.error('Error fetching expert profile:', expertError);
        toast.error('No expert profile found for this account');
        
        // Sign out since this is not a valid expert
        await supabase.auth.signOut();
        return false;
      }
      
      setCurrentExpert(expertData as ExpertProfile);
      toast.success('Expert login successful');
      return true;
    } catch (error) {
      console.error('Expert login unexpected error:', error);
      toast.error('An unexpected error occurred during login');
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

  // Register function
  const register = async (data: any): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            specialty: data.specialty
          }
        }
      });
      
      if (authError) {
        setError(authError.message);
        toast.error(authError.message);
        return false;
      }
      
      if (!authData.session) {
        setError('Registration failed. No session created.');
        toast.error('Registration failed. No session created.');
        return false;
      }
      
      // Create expert profile
      const expertData = {
        auth_id: authData.user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        specialization: data.specialty || '',
        status: 'pending'
      };
      
      const { error: profileError } = await supabase
        .from('expert_accounts')
        .insert([expertData]);
      
      if (profileError) {
        setError(profileError.message);
        toast.error(profileError.message);
        
        // Clean up - sign out the created auth account
        await supabase.auth.signOut();
        return false;
      }
      
      toast.success('Registration successful! Please wait for admin approval.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
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

  // Check if user has a user account
  const hasUserAccount = async (): Promise<boolean> => {
    if (!currentExpert?.auth_id) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentExpert.auth_id)
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

  return (
    <ExpertAuthContext.Provider
      value={{
        currentExpert,
        isAuthenticated: !!currentExpert,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
        hasUserAccount
      }}
    >
      {children}
    </ExpertAuthContext.Provider>
  );
};
