
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export const useExpertAuth = () => {
  // Instead of throwing an error if auth context isn't available, provide a fallback
  let auth;
  
  try {
    auth = useContext(AuthContext);
  } catch (error) {
    console.error('Error accessing AuthContext:', error);
    auth = null;
  }
  
  if (!auth) {
    console.error('useExpertAuth must be used within an AuthProvider');
    // Return a default context with empty values instead of throwing
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
      register: async () => false
    };
  }
  
  // Enhanced debug logging
  console.log('Expert auth state:', {
    isAuthenticated: auth.isAuthenticated,
    hasExpertProfile: !!auth.expertProfile,
    role: auth.role,
    isLoading: auth.isLoading
  });
  
  // Create a wrapped login function that provides better feedback
  const handleExpertLogin = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    // Make sure login function exists in auth context
    if (!auth.login || typeof auth.login !== 'function') {
      console.error('Expert login function not available:', { 
        authAvailable: !!auth,
        loginType: typeof auth.login,
        authKeys: Object.keys(auth)
      });
      toast.error('Authentication service is temporarily unavailable');
      return false;
    }
    
    console.log('Expert login function called with:', { email });
    try {
      // Set session type to expert BEFORE login attempt
      localStorage.setItem('sessionType', 'expert');
      localStorage.setItem('preferredRole', 'expert');
      
      // Ensure we explicitly set asExpert to true
      const success = await auth.login(email, password, { asExpert: true });
      
      if (success) {
        console.log('Expert login successful');
      } else {
        console.error('Expert login failed');
      }
      
      return success;
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
    register: auth.registerExpert || (async () => false)
  };
};
