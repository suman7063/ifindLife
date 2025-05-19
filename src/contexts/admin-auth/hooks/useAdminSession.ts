
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AdminUser } from '../types';

export const useAdminSession = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [session, setSession] = useState<Session | null>(null);

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
        const defaultPermissions = {
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
          role: data.role as any,
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

  return {
    loading,
    isAuthenticated,
    user,
    error,
    session,
    fetchAdminUser
  };
};
