
import { useState, useEffect } from 'react';
import { AuthState, initialAuthState, UserRole } from '../types';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Fetch user data based on the authenticated user
  const fetchUserData = async (userId: string, role: UserRole) => {
    try {
      // This would fetch user profile data from the database
      console.log(`Fetching ${role} data for user ${userId}`);
      
      // Simulate fetching user data
      if (role === 'user') {
        const userProfile = {
          id: userId,
          name: 'Test User',
          email: 'test@example.com',
          phone: '+123456789',
          country: 'US',
          city: 'New York',
          currency: 'USD',
          profile_picture: null,
          wallet_balance: 100,
          created_at: new Date().toISOString(),
          favorite_experts: []
        } as UserProfile;
        
        setAuthState(prev => ({
          ...prev,
          profile: userProfile,
          userProfile,
          walletBalance: userProfile.wallet_balance
        }));
      }
      
      if (role === 'expert') {
        const expertProfile = {
          id: userId,
          name: 'Test Expert',
          email: 'expert@example.com',
          phone: '+123456789',
          country: 'US',
          city: 'San Francisco',
          status: 'online'
        } as ExpertProfile;
        
        setAuthState(prev => ({
          ...prev,
          expertProfile
        }));
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Simulate session check
        setTimeout(() => {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            isLoading: false
          }));
        }, 1000);
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isLoading: false,
          error: error as Error
        }));
      }
    };
    
    checkSession();
  }, []);

  return {
    authState,
    setAuthState,
    fetchUserData
  };
};
