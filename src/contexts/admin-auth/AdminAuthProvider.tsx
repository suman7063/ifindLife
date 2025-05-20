
import React, { ReactNode, createContext, useContext } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { AdminUser, AdminRole, AdminPermissions } from './types';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  // Added properties to match what components expect
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

// Provider component
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const adminAuth = useAdminAuth();
  
  // Context value with all required properties
  const value: AdminAuthContextType = {
    isAuthenticated: adminAuth.isAuthenticated,
    isLoading: adminAuth.isLoading,
    currentUser: adminAuth.currentUser,
    login: adminAuth.login,
    logout: adminAuth.logout,
    adminUsers: adminAuth.adminUsers,
    isSuperAdmin: adminAuth.isSuperAdmin,
    hasPermission: adminAuth.hasPermission,
    getAdminById: adminAuth.getAdminById,
    addAdmin: adminAuth.addAdmin,
    removeAdmin: adminAuth.removeAdmin,
    updateAdminPermissions: adminAuth.updateAdminPermissions,
    updateAdminRole: adminAuth.updateAdminRole
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
