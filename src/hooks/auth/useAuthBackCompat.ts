
import { useAuth } from '@/contexts/auth/AuthContext';
import { useState, useCallback } from 'react';

export const useAuthBackCompat = () => {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Compatibility function for login
  const handleLogin = useCallback(async (email: string, password: string, role?: string) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const success = await auth.login(email, password, role);
      return success;
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [auth]);
  
  // Compatibility function for signup
  const handleSignup = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // Use signup function from auth context if available
      if (auth.signup) {
        return await auth.signup(email, password, userData);
      }
      
      throw new Error('Signup function not available');
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [auth]);
  
  // Compatibility function for logout
  const handleLogout = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      return await auth.logout();
    } catch (err: any) {
      setErrorMessage(err.message || 'Logout failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [auth]);
  
  // Create compatibility objects for user and expert auth
  const userAuth = {
    currentUser: auth.userProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'user',
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.userProfile && !auth.isLoading,
    user: auth.user,
    updateProfile: auth.updateUserProfile,
    updatePassword: auth.updatePassword,
    addToFavorites: auth.addToFavorites,
    removeFromFavorites: auth.removeFromFavorites,
    rechargeWallet: auth.rechargeWallet,
    addReview: auth.addReview,
    reportExpert: auth.reportExpert,
    hasTakenServiceFrom: auth.hasTakenServiceFrom,
    getExpertShareLink: auth.getExpertShareLink,
    getReferralLink: auth.getReferralLink,
  };

  const expertAuth = {
    currentUser: auth.expertProfile,
    isAuthenticated: auth.isAuthenticated && auth.role === 'expert',
    login: handleLogin,
    logout: handleLogout,
    authLoading: auth.isLoading,
    loading: auth.isLoading,
    profileNotFound: !auth.expertProfile && !auth.isLoading,
    user: auth.user,
    updateProfile: auth.updateExpertProfile,
    updatePassword: auth.updatePassword
  };
  
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    userProfile: auth.userProfile,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isSubmitting,
    error: errorMessage,
    isLoading: auth.isLoading,
    userAuth,
    expertAuth
  };
};
