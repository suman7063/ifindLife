
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminAuthContext } from './AdminAuthContext';
import { AdminAuthContextType, AdminUser, AdminPermissions } from './types';

// Default permissions object
const defaultPermissions: AdminPermissions = {
  manageExperts: false,
  manageUsers: false,
  manageServices: false,
  manageContent: false,
  manageBilling: false,
  viewReports: false,
  manageAdmins: false
};

// Define permission levels for different admin roles
const rolePermissions: Record<string, AdminPermissions> = {
  admin: {
    manageExperts: true,
    manageUsers: true,
    manageServices: true,
    manageContent: true,
    manageBilling: false,
    viewReports: true,
    manageAdmins: false
  },
  superadmin: {
    manageExperts: true,
    manageUsers: true,
    manageServices: true,
    manageContent: true,
    manageBilling: true,
    viewReports: true,
    manageAdmins: true
  }
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setAdminUser(null);
          return;
        }
        
        const { user } = session;
        
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (adminError) {
          if (adminError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
            console.error('Error checking admin role:', adminError);
          }
          setAdminUser(null);
          return;
        }
        
        if (adminData && adminData.role) {
          const role = adminData.role;
          const permissions = rolePermissions[role] || defaultPermissions;
          
          setAdminUser({
            id: user.id,
            email: user.email || '',
            username: user.email?.split('@')[0] || 'Admin',
            role,
            permissions
          });
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error in admin auth check:', error);
        setError(error as Error);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAdminRole();
    });
    
    // Initial check
    checkAdminRole();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Verify if user has specific permission
  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions[permission] || false;
  };
  
  // Verify if user is superadmin
  const isSuperAdmin = (): boolean => {
    return adminUser?.role === 'superadmin';
  };
  
  const adminLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setAdminUser(null);
  };

  const contextValue: AdminAuthContextType = {
    currentUser: adminUser,
    loading,
    error,
    isAuthenticated: !!adminUser,
    hasPermission,
    isSuperAdmin,
    logout: adminLogout,
    isLoading: loading
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};
