
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { userRepository } from '@/repositories/userRepository';
import { expertRepository } from '@/repositories/expertRepository';
import { AuthState, SessionType } from '../types';

export const useAuthActions = (authState: AuthState, refreshCallback: () => void) => {
  
  const login = useCallback(async (email: string, password: string, options?: { asExpert?: boolean }): Promise<boolean> => {
    try {
      console.log('Login attempt:', { email, asExpert: options?.asExpert });
      
      // Set session type before login
      const sessionType = options?.asExpert ? 'expert' : 'user';
      localStorage.setItem('sessionType', sessionType);
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      if (!data.user || !data.session) {
        console.error('Login failed: No user or session returned');
        return false;
      }
      
      console.log('Login successful:', { 
        userId: data.user.id, 
        sessionType,
        hasSession: !!data.session 
      });
      
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, userData?: any): Promise<boolean> => {
    try {
      console.log('Signup attempt:', { email, hasUserData: !!userData });
      
      // Set default session type for signup
      localStorage.setItem('sessionType', 'user');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return false;
      }
      
      console.log('Signup successful:', { userId: data.user?.id });
      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Logout attempt');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return false;
      }
      
      // Clear session storage
      localStorage.removeItem('sessionType');
      localStorage.removeItem('preferredRole');
      
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout exception:', error);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (profileData: any): Promise<boolean> => {
    try {
      if (!authState.user?.id) {
        console.error('No user ID for profile update');
        return false;
      }
      
      const success = await userRepository.updateUser(authState.user.id, profileData);
      
      if (success) {
        refreshCallback();
      }
      
      return success;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  }, [authState.user?.id, refreshCallback]);

  const updateExpertProfile = useCallback(async (profileData: any): Promise<boolean> => {
    try {
      if (!authState.user?.id) {
        console.error('No user ID for expert profile update');
        return false;
      }
      
      const success = await expertRepository.updateExpert(authState.user.id, profileData);
      
      if (success) {
        refreshCallback();
      }
      
      return success;
    } catch (error) {
      console.error('Expert profile update error:', error);
      return false;
    }
  }, [authState.user?.id, refreshCallback]);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Password update exception:', error);
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    refreshCallback();
  }, [refreshCallback]);

  return {
    login,
    signup,
    logout,
    updateProfile,
    updateExpertProfile,
    updatePassword,
    refreshProfile
  };
};
