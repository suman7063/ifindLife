import React, { useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminAuthContext } from './AdminAuthContext';
import { AdminUser, AdminRole, AdminPermissions, initialAuthState } from './types';
import { defaultAdminUsers, testCredentials } from './constants';
import { toast } from 'sonner';

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const fetchAdminUser = async (userId: string) => {
    try {
      console.log('Fetching admin user with ID:', userId);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching admin user:', error);
        throw error;
      }

      if (data) {
        // Default permissions for admin users
        const defaultPermissions: AdminPermissions = {
          canManageUsers: data.role === 'super_admin' || data.role === 'superadmin',
          canManageExperts: data.role === 'super_admin' || data.role === 'superadmin',
          canManageContent: true,
          canViewAnalytics: true
        };

        const userData = await supabase.auth.getUser();
        const email = userData.data.user?.email || 'admin@example.com';
        const username = email.split('@')[0] || 'admin';

        const adminUser: AdminUser = {
          id: data.id,
          email: email,
          username: username,
          role: data.role as AdminRole,
          permissions: defaultPermissions,
          createdAt: data.created_at,
          lastLogin: new Date().toISOString()
        };
        console.log('Admin user found:', adminUser);
        setUser(adminUser);
        setIsAuthenticated(true);
      } else {
        console.log('No admin user found for ID:', userId);
        // User exists but not in admin_users table
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error fetching admin user:', error);
      setError(error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // First set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Admin auth state changed:', event);
          setSession(session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchAdminUser(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUser(null);
          }
        });

        // Then check for existing session
        const { data } = await supabase.auth.getSession();
        console.log('Initial admin auth check:', data.session ? 'Session found' : 'No session');
        setSession(data.session);
        
        if (data.session?.user) {
          await fetchAdminUser(data.session.user.id);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Error in admin auth:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Admin login attempt with:', emailOrUsername);
      
      // For development, show the inputs to help debug
      console.log(`Login credentials - Username: "${emailOrUsername}", Password length: ${password.length}`);
      
      // Handle test admin accounts directly
      const normalizedUsername = emailOrUsername.toLowerCase();
      
      // Check for admin user
      if (normalizedUsername === 'admin') {
        console.log('Detected admin login attempt');
        console.log(`Password check: Expected "${testCredentials.admin.password}", Got "${password}"`);
        
        if (password === testCredentials.admin.password) {
          console.log('Admin login successful with hardcoded credentials');
          
          // Get admin user from default admin users
          const adminUser = defaultAdminUsers.find(u => u.username.toLowerCase() === 'admin');
          if (adminUser) {
            setUser(adminUser);
            setIsAuthenticated(true);
            localStorage.setItem('sessionType', 'admin');
            toast.success('Successfully logged in as admin');
            setLoading(false);
            return true;
          }
        } else {
          console.log(`Password mismatch for admin user`);
          toast.error('Invalid credentials for admin user');
          setLoading(false);
          return false;
        }
      } 
      // Check for superadmin user
      else if (normalizedUsername === 'superadmin') {
        console.log('Detected superadmin login attempt');
        console.log(`Password check: Expected "${testCredentials.superadmin.password}", Got "${password}"`);
        
        if (password === testCredentials.superadmin.password) {
          console.log('Superadmin login successful with hardcoded credentials');
          
          // Get super admin user from default admin users
          const superAdmin = defaultAdminUsers.find(u => u.username.toLowerCase() === 'superadmin');
          if (superAdmin) {
            setUser(superAdmin);
            setIsAuthenticated(true);
            localStorage.setItem('sessionType', 'admin');
            toast.success('Successfully logged in as super admin');
            setLoading(false);
            return true;
          }
        } else {
          console.log(`Password mismatch for superadmin user`);
          toast.error('Invalid credentials for super admin user');
          setLoading(false);
          return false;
        }
      }
      // Check for IFLsuperadmin user 
      else if (normalizedUsername === 'iflsuperadmin') {
        console.log('Detected IFLsuperadmin login attempt');
        console.log(`Password check: Expected "${testCredentials.iflsuperadmin.password}", Got "${password}"`);
        
        if (password === testCredentials.iflsuperadmin.password) {
          console.log('IFLsuperadmin login successful with hardcoded credentials');
          
          // Find the IFLsuperadmin user
          const superAdmin = defaultAdminUsers.find(u => u.username.toLowerCase() === 'iflsuperadmin'.toLowerCase());
          if (superAdmin) {
            setUser(superAdmin);
            setIsAuthenticated(true);
            localStorage.setItem('sessionType', 'admin');
            toast.success('Successfully logged in as super admin');
            setLoading(false);
            return true;
          }
        } else {
          console.log(`Password mismatch for IFLsuperadmin user`);
          toast.error('Invalid credentials for IFL super admin');
          setLoading(false);
          return false;
        }
      }
      
      // If none of the hardcoded admin users matched, try with Supabase
      // For other users, use Supabase auth
      // Only attempt Supabase login if username contains @ or we add the domain
      const email = emailOrUsername.includes('@') 
        ? emailOrUsername 
        : `${emailOrUsername}@ifindlife.com`;
      
      console.log('Attempting regular admin login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Admin login error:', error);
        toast.error(error.message || 'Login failed');
        setLoading(false);
        return false;
      }

      if (data?.user) {
        localStorage.setItem('sessionType', 'admin');
        await fetchAdminUser(data.user.id);
        
        // If no admin user was found in the database but credentials matched,
        // use default admin data for super admin
        if (!isAuthenticated && email === 'IFLsuperadmin@ifindlife.com') {
          const superAdmin = defaultAdminUsers.find(u => u.email === 'IFLsuperadmin@ifindlife.com');
          if (superAdmin) {
            setUser(superAdmin);
            setIsAuthenticated(true);
            toast.success('Successfully logged in as super admin');
            return true;
          }
        }
        
        // Check if isAuthenticated was set in the fetch operation
        // Delay check to ensure state has updated
        setTimeout(() => {
          if (!isAuthenticated) {
            toast.error('User exists but is not registered as an admin');
          } else {
            toast.success('Successfully logged in as admin');
          }
        }, 100);
        
        return isAuthenticated;
      }
      
      toast.error('Invalid username or password');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error);
      toast.error(error.message || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('sessionType');
      toast.success('Successfully logged out');
      
      // Navigate to the logout confirmation page
      window.location.href = '/logout?type=admin';
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error);
      toast.error(error.message || 'Failed to logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has required role
  const checkRole = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Compute isSuperAdmin based on user role
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';

  // Create additional mock functions for backward compatibility
  const adminUsers = user ? [user, ...defaultAdminUsers.filter(u => u.id !== user.id)] : defaultAdminUsers;
  const addAdmin = (username: string, role: string) => true;
  const removeAdmin = (userId: string) => true;
  const updateAdminPermissions = (userId: string, permissions: AdminPermissions) => {};
  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    return !!user.permissions[permission as keyof AdminPermissions];
  };
  const getAdminById = (userId: string) => null;
  const updateAdminRole = (userId: string, role: string) => true;
  const permissions = user?.permissions || {};

  // Map legacy property names to new properties
  const currentUser = user;
  const isLoading = loading;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkRole,
        // Legacy properties for backward compatibility
        currentUser,
        isSuperAdmin,
        adminUsers,
        addAdmin,
        removeAdmin,
        updateAdminPermissions,
        hasPermission,
        getAdminById,
        updateAdminRole,
        permissions,
        isLoading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
