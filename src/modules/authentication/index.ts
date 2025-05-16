
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Types
export type UserRole = 'user' | 'expert' | 'admin' | null;

export interface AuthResult {
  success: boolean;
  data?: any;
  error?: any;
  redirect?: string;
}

// Core authentication functions
export const authenticate = {
  // Check current session
  async checkSession(): Promise<{isAuthenticated: boolean, role?: UserRole, userId?: string}> {
    try {
      console.log('Authentication module: Checking session...');
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        console.log('Authentication module: No session found');
        return { isAuthenticated: false };
      }
      
      // Get role from localStorage or fetch from profile
      const role = localStorage.getItem('sessionType') as UserRole || 'user';
      
      console.log('Authentication module: Session found, role:', role);
      return { 
        isAuthenticated: true, 
        role,
        userId: data.session.user.id 
      };
    } catch (err) {
      console.error('Authentication module: Session check error:', err);
      return { isAuthenticated: false };
    }
  },
  
  // User login
  async userLogin(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Authentication module: Attempting user login:', email);
      
      // Store intended role in localStorage before login attempt
      localStorage.setItem('sessionType', 'user');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Authentication module: Login error:', error);
        return { success: false, error };
      }
      
      if (!data.session) {
        console.error('Authentication module: Login failed - no session created');
        return { success: false, error: new Error('Login failed - no session created') };
      }
      
      console.log('Authentication module: Login successful');
      return { 
        success: true, 
        data,
        redirect: '/user-dashboard'
      };
    } catch (err) {
      console.error('Authentication module: Login exception:', err);
      return { success: false, error: err };
    }
  },
  
  // Expert login
  async expertLogin(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Authentication module: Attempting expert login:', email);
      
      // Store intended role in localStorage before login attempt
      localStorage.setItem('sessionType', 'expert');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Authentication module: Expert login error:', error);
        return { success: false, error };
      }
      
      if (!data.session) {
        console.error('Authentication module: Expert login failed - no session created');
        return { success: false, error: new Error('Login failed - no session created') };
      }
      
      console.log('Authentication module: Expert login successful');
      return { 
        success: true, 
        data,
        redirect: '/expert-dashboard'
      };
    } catch (err) {
      console.error('Authentication module: Expert login exception:', err);
      return { success: false, error: err };
    }
  },
  
  // Logout
  async logout(): Promise<AuthResult> {
    try {
      console.log('Authentication module: Attempting logout');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Authentication module: Logout error:', error);
        return { success: false, error };
      }
      
      // Clear role information
      localStorage.removeItem('sessionType');
      
      console.log('Authentication module: Logout successful');
      return { 
        success: true,
        redirect: '/user-login'
      };
    } catch (err) {
      console.error('Authentication module: Logout exception:', err);
      return { success: false, error: err };
    }
  }
};

// Navigation helpers
export const navigation = {
  // Handle redirect after auth actions
  handleAuthRedirect(result: AuthResult) {
    if (result.success && result.redirect) {
      console.log('Authentication module: Redirecting to:', result.redirect);
      
      try {
        window.location.href = result.redirect;
      } catch (err) {
        console.error('Authentication module: Redirect error:', err);
        
        // Fallback approach
        setTimeout(() => {
          window.location.replace(result.redirect);
        }, 100);
      }
      
      return true;
    }
    
    return false;
  },
  
  // Redirect to specific page
  redirectTo(path: string) {
    console.log('Authentication module: Redirecting to:', path);
    window.location.href = path;
  }
};
