
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useExpertAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    console.error('useExpertAuth must be used within an AuthProvider');
    return {
      currentExpert: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {
        toast.error('Authentication service not available');
        return false;
      },
      logout: async () => {
        toast.error('Authentication service not available');
        return false;
      },
      updateProfile: async () => false,
      updateExpertProfile: async () => false,
      error: 'Auth context not found',
      initialized: false,
      hasUserAccount: false,
      register: async () => false,
      role: null
    };
  }
  
  console.log('Expert auth state:', {
    isAuthenticated: auth.isAuthenticated,
    hasExpertProfile: !!auth.expertProfile,
    role: auth.role,
    isLoading: auth.isLoading
  });
  
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    try {
      console.log('Expert login attempt for:', email);
      
      // Set session type to expert BEFORE login attempt
      localStorage.setItem('sessionType', 'expert');
      localStorage.setItem('preferredRole', 'expert');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Expert login error:', error);
        toast.error(error.message || 'Login failed');
        return false;
      }
      
      if (data.user) {
        console.log('Expert login successful');
        toast.success('Login successful!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during expert login:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    }
  };
  
  return {
    currentExpert: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    isLoading: auth.isLoading,
    login: handleExpertLogin,
    logout: auth.logout,
    updateProfile: auth.updateProfile,
    updateExpertProfile: auth.updateExpertProfile,
    error: auth.error,
    initialized: !auth.isLoading,
    hasUserAccount: auth.hasUserAccount || false,
    register: auth.registerExpert || (async () => false),
    role: auth.role
  };
};
