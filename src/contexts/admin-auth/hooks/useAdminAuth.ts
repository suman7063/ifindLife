
import { useContext } from 'react';
import { AdminAuthContext } from '../AdminAuthContext';
import { supabase } from '@/lib/supabase';
import { AdminUser } from '../types';
import { testCredentials } from '../constants';

export const useAdminAuth = () => {
  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuth: Login attempt for ${usernameOrEmail}`);
    
    try {
      // Check for test credentials first
      const normalizedInput = usernameOrEmail.toLowerCase();
      
      // Try to match against test credentials
      if (
        (normalizedInput === testCredentials.admin.username.toLowerCase() && 
         password === testCredentials.admin.password) ||
        (normalizedInput === testCredentials.superadmin.username.toLowerCase() && 
         password === testCredentials.superadmin.password) ||
        (normalizedInput === testCredentials.iflsuperadmin.username.toLowerCase() && 
         password === testCredentials.iflsuperadmin.password)
      ) {
        console.log(`AdminAuth: Test credential match found for ${usernameOrEmail}`);
        
        // For test cases, we'll use the matched credentials
        let matchedCredential;
        
        if (normalizedInput === testCredentials.admin.username.toLowerCase()) {
          matchedCredential = testCredentials.admin;
        } else if (normalizedInput === testCredentials.superadmin.username.toLowerCase()) {
          matchedCredential = testCredentials.superadmin;
        } else {
          matchedCredential = testCredentials.iflsuperadmin;
        }
        
        console.log(`AdminAuth: Logging in as test user ${matchedCredential.username} with role ${matchedCredential.role}`);
        
        // Use email address with @ifindlife.com domain for Supabase auth
        const email = `${matchedCredential.username}@ifindlife.com`;
        
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
      
      // For non-test credentials, try regular Supabase auth
      // First, check if input is an email or username
      const isEmail = usernameOrEmail.includes('@');
      
      let email = isEmail ? usernameOrEmail : `${usernameOrEmail}@ifindlife.com`;
      
      console.log(`AdminAuth: Attempting Supabase auth with ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('AdminAuth: Supabase auth error:', error);
        return false;
      }
      
      // Check if user exists in admin_users table
      if (data.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (adminError || !adminData) {
          console.error('AdminAuth: Not an admin user:', adminError);
          // User exists but not as admin
          await supabase.auth.signOut();
          return false;
        }
        
        console.log('AdminAuth: Admin login successful for user ID:', data.user.id);
        return true;
      }
      
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
