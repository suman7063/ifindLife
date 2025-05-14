
import React, { useState, useEffect } from 'react';
import { AdminAuthContext, AdminUser, AdminPermissions } from './AdminAuthContext';

// Mock admin users for development
const mockAdminUsers: AdminUser[] = [
  { id: '1', username: 'admin', role: 'admin' },
  { id: '2', username: 'superadmin', role: 'superadmin' },
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
  
  // Check local storage for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        setCurrentUser(parsedUser);
        setPermissions(getDefaultPermissions(parsedUser.role));
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
    
    const user = mockAdminUsers.find(u => u.username === username);
    if (!user) return false;
    
    setCurrentUser(user);
    setPermissions(getDefaultPermissions(user.role));
    
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
  
  return (
    <AdminAuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      adminUsers: mockAdminUsers,
      permissions,
      hasPermission
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
