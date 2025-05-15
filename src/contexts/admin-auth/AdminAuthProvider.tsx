
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthContextType, AdminPermissions } from './types';
import { defaultAdminUsers } from './constants';

// Create context with default values
const AdminAuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  addAdmin: () => false,
  removeAdmin: () => false,
  isSuperAdmin: false,
  updateAdminPermissions: () => false,
  isLoading: true,
  updateAdminUser: () => false
});

// Admin auth provider component
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check local storage for existing session on mount
  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Simple login function
  const login = (username: string, password: string): boolean => {
    // For demo purposes, any non-empty password works
    if (!username || !password) return false;
    
    const user = adminUsers.find(u => u.username === username);
    if (!user) return false;
    
    setCurrentUser(user);
    
    // Store in localStorage for persistence
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    return true;
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser');
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

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
        setCurrentUser(prev => prev ? {
          ...prev,
          permissions: { ...prev.permissions, ...newPermissions }
        } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating admin permissions:', error);
      return false;
    }
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>): boolean => {
    try {
      setAdminUsers(prev => prev.map(admin => {
        if (admin.id === id) {
          const updatedAdmin = { ...admin, ...updates };
          
          // Update current user if it's the logged-in user
          if (currentUser?.id === id) {
            setCurrentUser(updatedAdmin);
            localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
          }
          
          return updatedAdmin;
        }
        return admin;
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating admin:', error);
      return false;
    }
  };

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
  
  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated: !!currentUser,
      currentUser,
      login,
      logout,
      adminUsers,
      addAdmin,
      removeAdmin,
      isSuperAdmin,
      updateAdminPermissions,
      isLoading,
      updateAdminUser
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Export the custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};
