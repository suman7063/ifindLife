import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminUser, AdminRole } from './types';

export const useAdminSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initial session check
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          await checkAdminStatus(data.session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };
    
    getSession();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          await checkAdminStatus(currentSession.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          throw error;
        }
        
        setUser(null);
        setIsAuthenticated(false);
      } else if (data) {
        const adminUser: AdminUser = {
          id: userId,
          email: session?.user?.email || '',
          username: session?.user?.email?.split('@')[0] || 'admin', // Generate username from email
          role: data.role as AdminRole,
          permissions: { // Default permissions based on role
            canViewAnalytics: true,
            canManageContent: data.role === 'super_admin' || data.role === 'superadmin',
            canManageUsers: data.role === 'super_admin' || data.role === 'superadmin',
            canManageExperts: data.role === 'super_admin' || data.role === 'superadmin',
            canManageServices: data.role === 'super_admin' || data.role === 'superadmin'
          },
          createdAt: data.created_at || new Date().toISOString(),
          lastLogin: new Date().toISOString() // Set current login time
        };
        
        setUser(adminUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Check if user is admin
      if (data.user) {
        await checkAdminStatus(data.user.id);
        return isAuthenticated;
      }
      
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  };
};
