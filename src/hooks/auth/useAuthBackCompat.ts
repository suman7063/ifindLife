
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { useSupabaseAuth } from '../useSupabaseAuth';

/**
 * Compatibility layer to provide backward compatibility with older components
 * that expect the old auth pattern
 */
export const useAuthBackCompat = () => {
  const authContext = useContext(AuthContext);
  const supabaseAuth = useSupabaseAuth();
  
  // Create a user auth-compatible object from the unified auth system
  const userAuth = {
    currentUser: authContext?.userProfile || null,
    isAuthenticated: authContext?.isAuthenticated && authContext.role === 'user',
    loading: authContext?.isLoading || false,
    authLoading: authContext?.isLoading || false,
    initialized: !authContext?.isLoading,
    user: authContext?.user || null,
    login: authContext?.login || supabaseAuth.login,
    logout: authContext?.logout || supabaseAuth.logout,
    signup: authContext?.signup || supabaseAuth.signup,
    resetPassword: authContext?.resetPassword || supabaseAuth.resetPassword,
    updatePassword: authContext?.updatePassword || supabaseAuth.updatePassword,
    error: null
  };
  
  // Create an expert auth-compatible object from the unified auth system
  const expertAuth = {
    currentExpert: authContext?.expertProfile || null,
    isAuthenticated: authContext?.isAuthenticated && authContext.role === 'expert',
    loading: authContext?.isLoading || false,
    authLoading: authContext?.isLoading || false,
    initialized: !authContext?.isLoading,
    user: authContext?.user || null,
    login: authContext?.expertLogin || supabaseAuth.login,
    logout: authContext?.logout || supabaseAuth.logout,
    register: authContext?.expertSignup || supabaseAuth.signup,
    updateProfile: authContext?.updateExpertProfile || (async () => false),
    error: null
  };
  
  return { userAuth, expertAuth };
};
