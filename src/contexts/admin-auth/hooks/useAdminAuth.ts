
import { useContext } from 'react';
import { AdminAuthContext } from '../AdminAuthContext';
import { supabase } from '@/lib/supabase';
import { AdminUser, AdminRole, AdminPermissions } from '../types';
import { testCredentials } from '../constants';

// Default permissions for test accounts
const DEFAULT_PERMISSIONS: AdminPermissions = {
  canManageUsers: true,
  canManageExperts: true,
  canManageContent: true,
  canManageServices: true,
  canManagePrograms: true,
  canViewAnalytics: true,
  canDeleteContent: true,
  canApproveExperts: true,
  canManageBlog: true,
  canManageTestimonials: true
};

export const useAdminAuth = () => {
  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuth: Login attempt for ${usernameOrEmail}`);
    
    try {
      // Check for test credentials first
      const normalizedInput = usernameOrEmail.toLowerCase();
      
      // Only check for IFLsuperadmin credentials
      if (normalizedInput === testCredentials.iflsuperadmin.username.toLowerCase() && 
         password === testCredentials.iflsuperadmin.password) {
        console.log(`AdminAuth: Test credential match found for ${usernameOrEmail}`);
        
        // Use email address with @ifindlife.com domain for Supabase auth
        const email = `${testCredentials.iflsuperadmin.username}@ifindlife.com`;
        
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // If there's an error with Supabase auth during testing, log it but continue
          console.error('AdminAuth: Supabase auth error for test account:', error);
          console.log('AdminAuth: Using mock authentication for test account');
          
          // Success with test credentials
          return true;
        }
        
        console.log('AdminAuth: Test account login successful with Supabase');
        return true;
      }
      
      // For non-IFLsuperadmin accounts, authentication fails
      console.log('AdminAuth: Invalid credentials - only IFLsuperadmin is allowed');
      return false;
    } catch (error) {
      console.error('AdminAuth: Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('AdminAuth: Logout error:', error);
      return false;
    }
  };

  return {
    login,
    logout
  };
};
