
import { useState, useEffect } from 'react';
import { useUnifiedAuth } from '../auth/UnifiedAuthContext';
import { testCredentials } from './constants';
import { supabase } from '@/lib/supabase';
import { AdminUser } from '@/types/auth';

export const useAdminAuth = () => {
  const unifiedAuth = useUnifiedAuth();
  const { currentUser, isAuthenticated, isLoading, login: unifiedLogin, logout: unifiedLogout } = unifiedAuth;
  
  // Check if current user is an admin
  const isAdmin = isAuthenticated && currentUser && 
    (currentUser.role === 'admin' || currentUser.role === 'super_admin');

  // Login function specifically for admin
  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuth: Login attempt for ${usernameOrEmail}`);
    
    // Only allow IFLsuperadmin to login
    if (usernameOrEmail.toLowerCase() !== testCredentials.iflsuperadmin.username.toLowerCase()) {
      console.log('AdminAuth: Invalid credentials - only IFLsuperadmin is allowed');
      return false;
    }
    
    if (password !== testCredentials.iflsuperadmin.password) {
      console.log('AdminAuth: Invalid password for IFLsuperadmin');
      return false;
    }
    
    try {
      // Use the unified login with 'admin' type
      return await unifiedLogin(usernameOrEmail, password, 'admin');
    } catch (error) {
      console.error('AdminAuth: Login error:', error);
      return false;
    }
  };

  // Logout function 
  const logout = async (): Promise<boolean> => {
    return await unifiedLogout();
  };

  // Return the admin-specific auth context
  return {
    login,
    logout,
    isAuthenticated: isAdmin,
    isLoading,
    currentUser: isAdmin ? currentUser as AdminUser : null
  };
};
