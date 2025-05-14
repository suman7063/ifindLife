
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, initialAuthState, UserRole } from '../types';
import { userRepository } from '@/repositories/UserRepository';
import { expertRepository } from '@/repositories/ExpertRepository';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  /**
   * Fetch user profile data from the database
   */
  const fetchUserData = async (userId: string | undefined) => {
    if (!userId) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        loading: false,
        userProfile: null,
        profile: null,
        expertProfile: null,
        role: null,
        sessionType: 'none',
        isAuthenticated: false
      }));
      return;
    }

    try {
      console.log('Fetching user data for ID:', userId);
      
      // Fetch user profile using repository
      const userProfile = await userRepository.getUser(userId);
      
      // Fetch expert profile using repository
      const expertProfile = await expertRepository.getExpertByAuthId(userId);
      
      // Determine role based on profiles
      const role = await checkUserRole(userId, userProfile, expertProfile);
      
      // Determine session type
      const sessionType = determineSessionType(userProfile, expertProfile);
      
      // Get wallet balance
      const walletBalance = userProfile?.wallet_balance || 0;
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        loading: false,
        profile: userProfile,
        userProfile,
        expertProfile,
        role,
        sessionType,
        walletBalance,
        isAuthenticated: true
      }));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        loading: false,
        isAuthenticated: false
      }));
    }
  };
  
  /**
   * Determine session type based on available profiles
   */
  const determineSessionType = (
    userProfile: UserProfile | null, 
    expertProfile: ExpertProfile | null
  ): 'none' | 'user' | 'expert' | 'dual' => {
    if (userProfile && expertProfile) return 'dual';
    if (userProfile) return 'user';
    if (expertProfile) return 'expert';
    return 'none';
  };

  /**
   * Check user role from either profiles or origin setting
   */
  const checkUserRole = async (
    userId: string,
    userProfile: UserProfile | null,
    expertProfile: ExpertProfile | null
  ): Promise<UserRole | null> => {
    // If there's an approved expert profile, we have an expert role
    if (expertProfile && expertProfile.status === 'approved') {
      return 'expert';
    }
    
    // Check for admin role
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
        
      if (data && data.role) {
        return 'admin';
      }
    } catch (error) {
      console.error('Error checking for admin role:', error);
    }
    
    // If there's a user profile but no expert profile, or expert profile is not approved
    if (userProfile) {
      return 'user';
    }
    
    // If we have a pending expert but no user profile
    if (expertProfile) {
      return 'expert'; // This will still be limited by status checks elsewhere
    }
    
    // No valid profiles found
    return null;
  };

  return {
    authState,
    setAuthState,
    fetchUserData,
    checkUserRole
  };
};
