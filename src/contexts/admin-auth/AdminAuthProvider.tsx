
import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminUser, AdminRole, AdminPermissions } from './types';
import { testCredentials } from './constants';

// Add React debugging
console.log('AdminAuthProvider - React available:', !!React);
console.log('AdminAuthProvider - createContext available:', !!createContext);

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  adminUsers: AdminUser[];
  isSuperAdmin: (user?: AdminUser | null) => boolean;
  hasPermission: (user: AdminUser | null, permission: keyof AdminPermissions) => boolean;
  getAdminById: (id: string) => AdminUser | null;
  addAdmin: (admin: Partial<AdminUser>) => void;
  removeAdmin: (adminId: string) => void;
  updateAdminPermissions: (adminId: string, permissions: AdminPermissions) => void;
  updateAdminRole: (adminId: string, role: AdminRole) => boolean;
}

// Create context with default values
export const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  login: async () => false,
  logout: async () => false,
  adminUsers: [],
  isSuperAdmin: () => false,
  hasPermission: () => false,
  getAdminById: () => null,
  addAdmin: () => {},
  removeAdmin: () => {},
  updateAdminPermissions: () => {},
  updateAdminRole: () => false
});

// Hook to use the admin auth context
export const useAuth = (): AdminAuthContextType => {
  return useContext(AdminAuthContext);
};

// Default permissions for test accounts
const DEFAULT_PERMISSIONS: AdminPermissions = {
  canManageUsers: true,
  canManageExperts: true,
  canManageContent: true,
  canManageServices: true,
  canManagePrograms: true,
  canViewAnalytics: true,
  canDeleteContent: true,
  canApproveExperts: true,
  canManageBlog: true,
  canManageTestimonials: true
};

// Helper function to create AdminUser objects with all required properties
const createAdminUser = (userData: Partial<AdminUser> & { id: string; username: string; email: string; role: AdminRole }): AdminUser => {
  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    permissions: userData.permissions || DEFAULT_PERMISSIONS,
    isActive: userData.isActive ?? true,
    createdAt: userData.createdAt || new Date().toISOString(),
    lastLogin: userData.lastLogin || new Date().toISOString()
  };
};

// Provider component
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('AdminAuthProvider rendering...');
  
  // State management directly in provider to avoid hook issues
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  // Mock admin users for testing
  const [adminUsers] = useState<AdminUser[]>([
    createAdminUser({
      id: '1',
      username: 'IFLsuperadmin',
      email: 'iflsuperadmin@ifindlife.com',
      role: 'super_admin',
      permissions: DEFAULT_PERMISSIONS,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    })
  ]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking admin auth status...');
        const { data } = await supabase.auth.getSession();
        
        if (data.session && data.session.user.email?.includes('@ifindlife.com')) {
          const adminUser = createAdminUser({
            id: data.session.user.id,
            username: 'IFLsuperadmin',
            email: data.session.user.email,
            role: 'super_admin',
            permissions: DEFAULT_PERMISSIONS,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          console.log('Admin authenticated successfully');
        }
      } catch (error) {
        console.error('Error checking admin auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuth: Login attempt for ${usernameOrEmail}`);
    
    try {
      const normalizedInput = usernameOrEmail.toLowerCase();
      
      if (normalizedInput === testCredentials.iflsuperadmin.username.toLowerCase() && 
         password === testCredentials.iflsuperadmin.password) {
        console.log(`AdminAuth: Test credential match found for ${usernameOrEmail}`);
        
        const email = `${testCredentials.iflsuperadmin.username}@ifindlife.com`;
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('AdminAuth: Supabase auth error for test account:', error);
          console.log('AdminAuth: Using mock authentication for test account');
          
          // Mock authentication for test account
          const adminUser = createAdminUser({
            id: '1',
            username: 'IFLsuperadmin',
            email: email,
            role: 'super_admin',
            permissions: DEFAULT_PERMISSIONS,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          return true;
        }
        
        console.log('AdminAuth: Test account login successful with Supabase');
        
        const adminUser = createAdminUser({
          id: data.user.id,
          username: 'IFLsuperadmin',
          email: data.user.email || email,
          role: 'super_admin',
          permissions: DEFAULT_PERMISSIONS,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        return true;
      }
      
      console.log('AdminAuth: Invalid credentials - only IFLsuperadmin is allowed');
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
      
      setCurrentUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('AdminAuth: Logout error:', error);
      return false;
    }
  };

  const isSuperAdmin = (user?: AdminUser | null): boolean => {
    const userToCheck = user || currentUser;
    return userToCheck?.role === 'super_admin';
  };

  const hasPermission = (user: AdminUser | null, permission: keyof AdminPermissions): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions[permission] || false;
  };

  const getAdminById = (id: string): AdminUser | null => {
    return adminUsers.find(admin => admin.id === id) || null;
  };

  const addAdmin = (admin: Partial<AdminUser>): void => {
    console.log('Add admin called:', admin);
  };

  const removeAdmin = (adminId: string): void => {
    console.log('Remove admin called:', adminId);
  };

  const updateAdminPermissions = (adminId: string, permissions: AdminPermissions): void => {
    console.log('Update admin permissions called:', adminId, permissions);
  };

  const updateAdminRole = (adminId: string, role: AdminRole): boolean => {
    console.log('Update admin role called:', adminId, role);
    return true;
  };

  const value: AdminAuthContextType = {
    isAuthenticated,
    isLoading,
    currentUser,
    login,
    logout,
    adminUsers,
    isSuperAdmin,
    hasPermission,
    getAdminById,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminRole
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
