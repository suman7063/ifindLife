
import { useState } from 'react';
import { AuthState, UserRole } from '../types';
import { supabase } from '@/lib/supabase';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { userRepository } from '@/repositories/UserRepository';
import { expertRepository } from '@/repositories/ExpertRepository';
import { toast } from 'sonner';

export const useAuthFunctions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle user login with email and password
   */
  const login = async (
    email: string, 
    password: string, 
    loginAs?: 'user' | 'expert'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Attempting login with email: ${email}, as ${loginAs || 'default'}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }
      
      if (!data.session || !data.user) {
        console.error('No session or user returned from login');
        toast.error('Login failed. Please try again.');
        return false;
      }
      
      const userId = data.user.id;
      let userProfile = null;
      let expertProfile = null;
      
      // Always fetch user profile
      userProfile = await userRepository.getUser(userId);
      
      // If logging in as expert or if explicitly specified, fetch expert profile
      if (loginAs === 'expert' || sessionStorage.getItem('loginOrigin') === 'expert') {
        expertProfile = await expertRepository.getExpertByAuthId(userId);
        
        // If no expert profile found but logging in as expert, show error
        if (!expertProfile && loginAs === 'expert') {
          toast.error('No expert profile found for this account');
          await logout();
          return false;
        }
      } else {
        // For non-expert logins, still check for expert profile for dual account detection
        expertProfile = await expertRepository.getExpertByAuthId(userId);
      }
      
      // Determine session type and role
      const sessionType = determineSessionType(userProfile, expertProfile);
      const role = determineRole(userProfile, expertProfile);
      
      console.log(`Login successful: Session type: ${sessionType}, Role: ${role}`);
      
      // Update auth state
      setAuthState({
        ...authState,
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
        session: data.session,
        userProfile,
        profile: userProfile,
        expertProfile,
        sessionType,
        role,
        authStatus: 'authenticated',
        walletBalance: userProfile?.wallet_balance || 0
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle user registration
   */
  const signup = async (
    email: string, 
    password: string,
    userData?: Partial<UserProfile>,
    referralCode?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Signing up with email:', email);
      
      // Prepare metadata for signup
      const metadata = {
        name: userData?.name,
        phone: userData?.phone,
        country: userData?.country,
        city: userData?.city,
        referral_code: referralCode
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }
      
      console.log('Signup successful');
      toast.success('Account created successfully! Please verify your email.');
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle user logout
   */
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return false;
      }
      
      // Reset auth state
      setAuthState({
        ...initialState,
        isLoading: false,
      });
      
      console.log('Logout successful');
      
      // Clear any stored data
      localStorage.removeItem('expertProfile');
      localStorage.removeItem('userProfile');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!authState.user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const userId = authState.user.id;
      const success = await userRepository.updateUser(userId, updates);
      
      if (!success) {
        toast.error('Failed to update profile');
        return false;
      }
      
      // Refresh user data
      const updatedProfile = await userRepository.getUser(userId);
      
      setAuthState({
        ...authState,
        userProfile: updatedProfile,
        profile: updatedProfile,
        walletBalance: updatedProfile?.wallet_balance || 0
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update expert profile
   */
  const updateExpertProfile = async (updates: Partial<ExpertProfile>): Promise<boolean> => {
    if (!authState.user || !authState.expertProfile) {
      toast.error('You must be logged in as an expert to update your profile');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const expertId = authState.expertProfile.id;
      const success = await expertRepository.updateExpert(expertId, updates);
      
      if (!success) {
        toast.error('Failed to update expert profile');
        return false;
      }
      
      // Refresh expert data
      const updatedProfile = await expertRepository.getExpert(expertId);
      
      setAuthState({
        ...authState,
        expertProfile: updatedProfile
      });
      
      toast.success('Expert profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('An error occurred while updating your expert profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update user password
   */
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating your password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine session type
  const determineSessionType = (
    userProfile: UserProfile | null,
    expertProfile: ExpertProfile | null
  ): 'none' | 'user' | 'expert' | 'dual' => {
    if (userProfile && expertProfile) return 'dual';
    if (userProfile) return 'user';
    if (expertProfile) return 'expert';
    return 'none';
  };
  
  // Helper function to determine user role
  const determineRole = (
    userProfile: UserProfile | null,
    expertProfile: ExpertProfile | null
  ): UserRole => {
    // If there's an approved expert profile, user has expert role
    if (expertProfile && expertProfile.status === 'approved') {
      return 'expert';
    }
    
    // Check for admin role (would need to be extended with proper check)
    // For now, simplify and just check for user profile
    if (userProfile) {
      return 'user';
    }
    
    // No valid profile
    return null;
  };
  
  // TODO: Implement these methods
  const addToFavorites = async (expertId: string | number): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const removeFromFavorites = async (expertId: string | number): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const rechargeWallet = async (amount: number): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const addReview = async (reviewData: any): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const reportExpert = async (reportData: any): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const hasTakenServiceFrom = async (expertId: string | number): Promise<boolean> => {
    // Implementation
    return false;
  };
  
  const getExpertShareLink = (expertId: string | number): string => {
    // Implementation
    return `/experts/${expertId}`;
  };
  
  const getReferralLink = (): string | null => {
    // Implementation
    return null;
  };
  
  // Initial state for resetting after logout
  const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    session: null,
    authStatus: 'unauthenticated',
    userProfile: null,
    profile: null,
    expertProfile: null,
    role: null,
    sessionType: 'none',
    walletBalance: 0,
  };
  
  return {
    login,
    logout,
    signup,
    updateProfile,
    updateExpertProfile,
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    rechargeWallet,
    addReview,
    reportExpert,
    hasTakenServiceFrom,
    getExpertShareLink,
    getReferralLink
  };
};
