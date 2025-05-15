
import React, { useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminAuthContext } from './AdminAuthContext';
import { AdminUser, AdminRole, AdminPermissions } from './types';
import { toast } from 'sonner';

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
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
          username: (await supabase.auth.getUser()).data.user?.email?.split('@')[0] || 'admin',
          role: data.role as AdminRole,
          permissions: defaultPermissions,
          createdAt: data.created_at
        };
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
      } else {
        // User exists but not in admin_users table
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error: any) {
      console.error('Error fetching admin user:', error);
      setError(error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          await fetchAdminUser(data.session.user.id);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchAdminUser(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Error in admin auth:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setIsAuthenticated(false);
      setCurrentUser(null);
      toast.success('Successfully logged out');
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error);
      toast.error(error.message || 'Failed to logout');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Compute isSuperAdmin based on user role
  const isSuperAdmin = currentUser?.role === 'superadmin';

  // Create the mock functionality for admin users management
  const adminUsers = currentUser ? [currentUser] : [];
  const addAdmin = () => true;
  const removeAdmin = () => true;
  const updateAdminPermissions = () => true;
  const hasPermission = () => true;
  const getAdminById = () => null;
  const updateAdminRole = () => true;
  const permissions = currentUser?.permissions || {};

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
        error,
        login,
        logout,
        isSuperAdmin,
        // Mock admin functionality for backward compatibility
        adminUsers,
        addAdmin,
        removeAdmin,
        updateAdminPermissions,
        hasPermission,
        getAdminById,
        updateAdminRole,
        permissions
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
