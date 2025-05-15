
import React, { useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminAuthContext } from './AdminAuthContext';
import { AdminUser, AdminRole, AdminPermissions, initialAuthState } from './types';
import { defaultAdminUsers } from './constants';
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
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Default permissions for admin users
        const defaultPermissions: AdminPermissions = {
          canManageUsers: true,
          canManageExperts: true,
          canManageContent: true
        };

        const adminUser: AdminUser = {
          id: data.id,
          email: (await supabase.auth.getUser()).data.user?.email || 'admin@example.com',
          username: (await supabase.auth.getUser()).data.user?.email?.split('@')[0] || 'admin',
          role: data.role as AdminRole,
          permissions: defaultPermissions,
          createdAt: data.created_at
        };
        setUser(adminUser);
        setIsAuthenticated(true);
      } else {
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
        
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          await fetchAdminUser(data.session.user.id);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchAdminUser(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUser(null);
          }
        });

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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        await fetchAdminUser(data.user.id);
        toast.success('Successfully logged in');
        return true;
      }
      
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
      toast.success('Successfully logged out');
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
  const isSuperAdmin = user?.role === 'super_admin';

  // Create additional mock functions for backward compatibility
  const adminUsers = user ? [user, ...defaultAdminUsers.filter(u => u.id !== user.id)] : defaultAdminUsers;
  const addAdmin = (username: string, role: string) => true;
  const removeAdmin = (userId: string) => true;
  const updateAdminPermissions = (userId: string, permissions: AdminPermissions) => {};
  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    return !!user.permissions[permission];
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
