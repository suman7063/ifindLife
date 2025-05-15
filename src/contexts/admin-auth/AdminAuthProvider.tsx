
import React, { useState, useEffect } from 'react';
import { AdminAuthContext, AdminUser, AdminPermissions } from './AdminAuthContext';

// Mock admin users for development with proper permissions
const mockAdminUsers: AdminUser[] = [
  { 
    id: '1', 
    username: 'admin', 
    role: 'admin',
    permissions: {
      canManageUsers: false,
      canManageExperts: true,
      canManagePrograms: true,
      canManageContent: true,
      canViewReports: true,
      canModerate: false
    }
  },
  { 
    id: '2', 
    username: 'superadmin', 
    role: 'superadmin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManagePrograms: true,
      canManageContent: true,
      canViewReports: true,
      canModerate: true
    }
  },
];

// Default permissions based on role
const getDefaultPermissions = (role: 'admin' | 'superadmin'): AdminPermissions => {
  if (role === 'superadmin') {
    return {
      canManageUsers: true,
      canManageExperts: true,
      canManagePrograms: true,
      canManageContent: true,
      canViewReports: true,
      canModerate: true
    };
  }
  
  return {
    canManageUsers: false,
    canManageExperts: true,
    canManagePrograms: true,
    canManageContent: true,
    canViewReports: true,
    canModerate: false
  };
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  
  // Check local storage for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        setCurrentUser(parsedUser);
        setPermissions(parsedUser.permissions);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);
  
  // Simple mock login function
  const login = (username: string, password: string): boolean => {
    // For demo purposes, any non-empty password works
    if (!username || !password) return false;
    
    const user = adminUsers.find(u => u.username === username);
    if (!user) return false;
    
    setCurrentUser(user);
    setPermissions(user.permissions);
    
    // Store in localStorage for persistence
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    return true;
  };
  
  const logout = () => {
    setCurrentUser(null);
    setPermissions(null);
    localStorage.removeItem('adminUser');
  };
  
  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!permissions) return false;
    return permissions[permission];
  };

  const isSuperAdmin = (): boolean => {
    return currentUser?.role === 'superadmin';
  };

  const addAdmin = (username: string, role: 'admin' | 'superadmin'): boolean => {
    try {
      const newAdmin: AdminUser = {
        id: `${adminUsers.length + 1}`,
        username,
        role,
        permissions: getDefaultPermissions(role)
      };

      setAdminUsers(prev => [...prev, newAdmin]);
      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      return false;
    }
  };

  const removeAdmin = (id: string): boolean => {
    try {
      setAdminUsers(prev => prev.filter(admin => admin.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      return false;
    }
  };

  const updateAdminPermissions = (userId: string, newPermissions: Partial<AdminPermissions>): boolean => {
    try {
      setAdminUsers(prev => prev.map(admin => {
        if (admin.id === userId) {
          return {
            ...admin,
            permissions: { ...admin.permissions, ...newPermissions }
          };
        }
        return admin;
      }));
      
      // Update current user permissions if it's the logged-in user
      if (currentUser?.id === userId) {
        setPermissions(prev => prev ? { ...prev, ...newPermissions } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating admin permissions:', error);
      return false;
    }
  };

  const getAdminById = (id: string): AdminUser | null => {
    return adminUsers.find(admin => admin.id === id) || null;
  };

  const updateAdminRole = (id: string, role: 'admin' | 'superadmin'): boolean => {
    try {
      setAdminUsers(prev => prev.map(admin => {
        if (admin.id === id) {
          const updatedAdmin = {
            ...admin,
            role,
            permissions: getDefaultPermissions(role)
          };
          
          // Update current user if it's the logged-in user
          if (currentUser?.id === id) {
            setCurrentUser(updatedAdmin);
            setPermissions(updatedAdmin.permissions);
            localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
          }
          
          return updatedAdmin;
        }
        return admin;
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating admin role:', error);
      return false;
    }
  };
  
  return (
    <AdminAuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      adminUsers,
      permissions,
      hasPermission,
      isSuperAdmin,
      addAdmin,
      removeAdmin,
      updateAdminPermissions,
      getAdminById,
      updateAdminRole
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
