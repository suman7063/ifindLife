
import React, { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminUser, AdminRole, AdminPermissions } from './types';
import { testCredentials } from './constants';
import { toast } from 'sonner';

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
  
  // State management with stable initialization
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

  // Check for existing admin session in localStorage
  const checkLocalAuth = useCallback(() => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        console.log('AdminAuthProvider: Found local admin session:', session);
        
        // Validate session is still valid (not expired)
        const sessionTime = new Date(session.timestamp).getTime();
        const now = new Date().getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - sessionTime < maxAge) {
          const adminUser = createAdminUser({
            id: session.id || '1',
            username: session.username,
            email: session.email,
            role: 'super_admin',
            permissions: DEFAULT_PERMISSIONS,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          console.log('AdminAuthProvider: Restored admin session');
          return true;
        } else {
          // Session expired, clear it
          localStorage.removeItem('adminSession');
          console.log('AdminAuthProvider: Admin session expired, cleared');
        }
      }
    } catch (error) {
      console.error('AdminAuthProvider: Error checking local auth:', error);
      localStorage.removeItem('adminSession');
    }
    return false;
  }, []);

  // Initial auth check
  useEffect(() => {
    console.log('AdminAuthProvider: Starting initial auth check...');
    
    // Check localStorage first for admin session
    const hasLocalAuth = checkLocalAuth();
    
    if (!hasLocalAuth) {
      // No local session found
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
    console.log('AdminAuthProvider: Initial auth check completed');
  }, [checkLocalAuth]);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuthProvider: Login attempt for ${usernameOrEmail}`);
    
    try {
      setIsLoading(true);
      const normalizedInput = usernameOrEmail.toLowerCase().trim();
      
      // Check test credentials
      if (normalizedInput === testCredentials.iflsuperadmin.username.toLowerCase() && 
         password === testCredentials.iflsuperadmin.password) {
        console.log(`AdminAuthProvider: Test credential match found for ${usernameOrEmail}`);
        
        const adminUser = createAdminUser({
          id: '1',
          username: 'IFLsuperadmin',
          email: 'iflsuperadmin@ifindlife.com',
          role: 'super_admin',
          permissions: DEFAULT_PERMISSIONS,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        
        // Store admin session in localStorage
        const adminSession = {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        
        console.log('AdminAuthProvider: Admin login successful');
        toast.success('Successfully logged in as administrator');
        return true;
      }
      
      console.log('AdminAuthProvider: Invalid credentials - only IFLsuperadmin is allowed');
      toast.error('Invalid credentials. Only IFLsuperadmin can log in.');
      return false;
    } catch (error) {
      console.error('AdminAuthProvider: Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      console.log('AdminAuthProvider: Logging out admin');
      
      // Clear localStorage
      localStorage.removeItem('adminSession');
      
      // Clear state
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      console.log('AdminAuthProvider: Admin logout successful');
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('AdminAuthProvider: Logout error:', error);
      toast.error('Logout failed');
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
    console.log('AdminAuthProvider: Add admin called:', admin);
  };

  const removeAdmin = (adminId: string): void => {
    console.log('AdminAuthProvider: Remove admin called:', adminId);
  };

  const updateAdminPermissions = (adminId: string, permissions: AdminPermissions): void => {
    console.log('AdminAuthProvider: Update admin permissions called:', adminId, permissions);
  };

  const updateAdminRole = (adminId: string, role: AdminRole): boolean => {
    console.log('AdminAuthProvider: Update admin role called:', adminId, role);
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

  console.log('AdminAuthProvider: Providing context with state:', {
    isAuthenticated,
    isLoading,
    hasCurrentUser: !!currentUser,
    currentUsername: currentUser?.username
  });

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
