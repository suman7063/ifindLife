import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContext, AuthContextType } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { AuthState, initialAuthState, UserRole } from './types';
import { toast } from 'sonner';
import { updateUserProfile, updateProfilePicture } from '@/utils/profileUpdater';
import { UserProfile } from '@/types/supabase';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState, fetchUserData } = useAuthState();
  
  // Authentication methods
  const signIn = async (email: string, password: string, loginAs?: 'user' | 'expert'): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast.error(`Login failed: ${error.message}`);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false, error }));
        return false;
      }
      
      if (!data.user) {
        console.error('No user data returned');
        toast.error('Login failed: No user data returned');
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
        return false;
      }
      
      // Update auth state - session will be updated via the onAuthStateChange listener
      setAuthState(prev => ({ 
        ...prev, 
        session: data.session,
        user: { 
          id: data.user.id, 
          email: data.user.email,
          role: prev.role 
        },
        isAuthenticated: true
      }));
      
      await fetchUserData(data.user);
      
      toast.success('Login successful');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message}`);
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false, error }));
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  };
  
  const signUp = async (email: string, password: string, userData?: any, referralCode?: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            referred_by: referralCode
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        toast.error(`Registration failed: ${error.message}`);
        setAuthState(prev => ({ ...prev, loading: false, isLoading: false, error }));
        return false;
      }
      
      // Even if signup succeeds, we may not have a session right away if email confirmation is required
      if (data.session) {
        // We have a session, so update auth state
        setAuthState(prev => ({ 
          ...prev, 
          session: data.session,
          user: { 
            id: data.user?.id, 
            email: data.user?.email,
            role: 'user' as UserRole
          },
          isAuthenticated: true
        }));
        
        if (data.user) {
          await fetchUserData(data.user);
        }
        
        toast.success('Registration successful');
      } else {
        // No session yet, show message to check email
        toast.success('Registration successful. Please check your email to confirm your account.');
      }
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(`Registration failed: ${error.message}`);
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false, error }));
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  };
  
  const signOut = async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error(`Logout failed: ${error.message}`);
        return false;
      }
      
      // Reset auth state to initial values
      setAuthState(initialAuthState);
      
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(`Logout failed: ${error.message}`);
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false, isLoading: false }));
    }
  };
  
  // Make updateProfile compatible with both profile types
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!authState.user?.id) {
      toast.error('Cannot update profile: No user logged in');
      return false;
    }
    
    // Convert the updates if necessary to be compatible with the expected format
    const formattedUpdates = {
      ...updates,
      // Handle favorite_programs conversion if needed
      favorite_programs: updates.favorite_programs 
        ? Array.isArray(updates.favorite_programs) 
          ? updates.favorite_programs.map(id => typeof id === 'string' ? id : String(id))
          : updates.favorite_programs
        : undefined
    };
    
    const success = await updateUserProfile(authState.user.id, formattedUpdates);
    
    if (success) {
      // Refresh user data after successful update
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        await fetchUserData(data.user);
      }
      toast.success('Profile updated successfully');
    } else {
      toast.error('Failed to update profile');
    }
    
    return success;
  };
  
  // Utility functions
  const clearSession = () => {
    setAuthState(initialAuthState);
  };
  
  // Create value object for AuthContext
  const contextValue: AuthContextType = {
    ...authState,
    
    // Main authentication methods
    signIn,
    signUp,
    signOut,
    
    // Aliases for backward compatibility
    login: signIn,
    signup: signUp,
    logout: signOut,
    
    // Profile management
    updateProfile,
    updateProfilePicture: async (file: File) => {
      if (!authState.user?.id) return null;
      try {
        const url = await updateProfilePicture(authState.user.id, file);
        if (url) {
          // Refresh user data after successful update
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            await fetchUserData(data.user);
          }
        }
        return url;
      } catch (error) {
        console.error('Error updating profile picture:', error);
        return null;
      }
    },
    
    // Session management
    clearSession
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
