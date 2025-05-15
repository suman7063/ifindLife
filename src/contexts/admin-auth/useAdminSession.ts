
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminUser, AdminAuthState, initialAdminAuthState } from './types';

export const useAdminSession = (): AdminAuthState => {
  const [state, setState] = useState<AdminAuthState>(initialAdminAuthState);

  useEffect(() => {
    const initSession = async () => {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setState(prevState => ({
            ...prevState,
            isLoading: false,
            isAuthenticated: false
          }));
          return;
        }

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (adminError || !adminData) {
          setState(prevState => ({
            ...prevState,
            isLoading: false,
            isAuthenticated: false
          }));
          return;
        }

        // User is authenticated as admin
        const isSuperAdmin = adminData.role === 'superadmin';

        // Create admin user object
        const adminUser: AdminUser = {
          id: adminData.id,
          username: session.user.email?.split('@')[0] || 'admin',
          role: adminData.role,
          permissions: {
            // Default permissions based on role
            canManageUsers: isSuperAdmin,
            canManageExperts: isSuperAdmin || adminData.role === 'admin',
            canManageContent: isSuperAdmin || adminData.role === 'content',
            canManageServices: isSuperAdmin,
            canManagePrograms: isSuperAdmin || adminData.role === 'admin',
            canViewAnalytics: isSuperAdmin,
            canDeleteContent: isSuperAdmin,
            canApproveExperts: isSuperAdmin,
            canManageBlog: isSuperAdmin || adminData.role === 'content',
            canManageTestimonials: isSuperAdmin || adminData.role === 'content',
          },
          lastLogin: new Date().toISOString()
        };

        setState({
          ...initialAdminAuthState,
          isLoading: false,
          isAuthenticated: true,
          currentUser: adminUser,
          isSuperAdmin,
          permissions: adminUser.permissions,
          adminUsers: [adminUser], // Initial list with just the current user
        });

      } catch (error) {
        console.error('Error initializing admin session:', error);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Failed to initialize session')
        }));
      }
    };

    initSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setState({
            ...initialAdminAuthState,
            isLoading: false,
            isAuthenticated: false
          });
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
