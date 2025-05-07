
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AdminUser, AdminPermissions, AuthContextType, defaultPermissions, superAdminPermissions } from './types';
import { defaultAdminUsers } from './constants';

// Create context with default values
const AdminAuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: [],
  addAdmin: () => {},
  removeAdmin: () => {},
  isSuperAdmin: false,
  currentUser: null,
  updateAdminPermissions: () => {},
  isLoading: true,
  updateAdminUser: () => {},
});

// Initial admin users are now only fetched from constants to avoid duplication
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login on component mount
  useEffect(() => {
    // Initialize admin users from localStorage or use defaults
    const storedAdminUsers = localStorage.getItem('admin-users');
    if (storedAdminUsers) {
      try {
        const parsedAdminUsers = JSON.parse(storedAdminUsers);
        setAdminUsers(parsedAdminUsers);
      } catch (error) {
        console.error('Error parsing stored admin users:', error);
        localStorage.removeItem('admin-users');
        setAdminUsers(defaultAdminUsers);
        // Save default admin users to localStorage
        localStorage.setItem('admin-users', JSON.stringify(defaultAdminUsers));
      }
    } else {
      // Save default admin users to localStorage
      localStorage.setItem('admin-users', JSON.stringify(defaultAdminUsers));
    }

    // Check for existing login session
    const storedUser = localStorage.getItem('admin-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored admin user:', error);
        localStorage.removeItem('admin-user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    console.log('Attempting login with:', { username });
    
    // Find matching admin user (case-insensitive for username)
    const foundUser = adminUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    console.log('Found user:', foundUser ? 'Yes' : 'No');

    if (foundUser) {
      // Update user with login timestamp
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      // Store user info in localStorage
      localStorage.setItem('admin-user', JSON.stringify(updatedUser));
      
      // Update the user in the admin users list
      updateAdminUser(foundUser.username, { lastLogin: updatedUser.lastLogin });
      
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addAdmin = (username: string, password: string, permissions: AdminPermissions = defaultPermissions) => {
    const newUser: AdminUser = {
      username,
      password,
      role: 'admin',
      permissions,
      createdAt: new Date().toISOString()
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
    if (currentUser && currentUser.username === username) {
      const updatedUser = { ...currentUser, permissions };
      setCurrentUser(updatedUser);
      localStorage.setItem('admin-user', JSON.stringify(updatedUser));
    }
  };

  const updateAdminUser = (username: string, userData: Partial<AdminUser>) => {
    const updatedUsers = adminUsers.map(user => {
      if (user.username === username) {
        return { ...user, ...userData };
      }
      return user;
    });
    
    setAdminUsers(updatedUsers);
    localStorage.setItem('admin-users', JSON.stringify(updatedUsers));
    
    // If the updated user is the current user, update the current user state and localStorage
    if (currentUser && currentUser.username === username) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('admin-user', JSON.stringify(updatedUser));
    }
  };

  // Check if current user is a super admin
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        adminUsers,
        addAdmin,
        removeAdmin,
        isSuperAdmin,
        currentUser,
        updateAdminPermissions,
        isLoading,
        updateAdminUser
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
