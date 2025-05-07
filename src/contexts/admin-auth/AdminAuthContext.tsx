
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AdminUser, AdminPermissions, AuthContextType, defaultPermissions, superAdminPermissions } from './types';

// Create context with default values
const AdminAuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  addAdmin: () => {},
  removeAdmin: () => {},
  isSuperAdmin: false,
  currentUser: null,
  updateAdminPermissions: () => {},
});

// Initial admin users
const initialAdminUsers: AdminUser[] = [
  { 
    username: 'admin', 
    password: 'admin123', 
    role: 'superadmin',
    permissions: superAdminPermissions 
  },
  { 
    username: 'editor', 
    password: 'editor123', 
    role: 'editor',
    permissions: defaultPermissions 
  },
];

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on component mount
  useEffect(() => {
    // Load admin users from localStorage or use defaults
    const storedAdminUsers = localStorage.getItem('admin-users');
    if (storedAdminUsers) {
      try {
        const parsedAdminUsers = JSON.parse(storedAdminUsers);
        setAdminUsers(parsedAdminUsers);
      } catch (error) {
        console.error('Error parsing stored admin users:', error);
        localStorage.removeItem('admin-users');
        setAdminUsers(initialAdminUsers);
      }
    } else {
      setAdminUsers(initialAdminUsers);
      // Save initial admin users
      localStorage.setItem('admin-users', JSON.stringify(initialAdminUsers));
    }

    // Check for existing login
    const storedUser = localStorage.getItem('admin-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('admin-user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Find matching admin user
    const foundUser = adminUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      // Store user info in localStorage
      localStorage.setItem('admin-user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-user');
    setUser(null);
  };

  const addAdmin = (username: string, password: string, permissions: AdminPermissions) => {
    const newUser: AdminUser = {
      username,
      password,
      role: 'admin',
      permissions
    };
    
    const updatedUsers = [...adminUsers, newUser];
    setAdminUsers(updatedUsers);
    localStorage.setItem('admin-users', JSON.stringify(updatedUsers));
  };

  const removeAdmin = (username: string) => {
    const updatedUsers = adminUsers.filter(user => user.username !== username);
    setAdminUsers(updatedUsers);
    localStorage.setItem('admin-users', JSON.stringify(updatedUsers));
  };

  const updateAdminPermissions = (username: string, permissions: AdminPermissions) => {
    const updatedUsers = adminUsers.map(user => {
      if (user.username === username) {
        return { ...user, permissions };
      }
      return user;
    });
    
    setAdminUsers(updatedUsers);
    localStorage.setItem('admin-users', JSON.stringify(updatedUsers));
    
    // If the updated user is the current user, update the current user state and localStorage
    if (user && user.username === username) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('admin-user', JSON.stringify(updatedUser));
    }
  };

  // Check if current user is a super admin
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        adminUsers,
        addAdmin,
        removeAdmin,
        isSuperAdmin,
        updateAdminPermissions,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};
