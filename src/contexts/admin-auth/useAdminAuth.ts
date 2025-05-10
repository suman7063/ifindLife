
import { useState } from 'react';
import { toast } from 'sonner';
import { AdminUser, defaultPermissions, AdminPermissions } from './types';

interface UseAdminAuthProps {
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  currentUser: AdminUser | null;
}

export const useAdminAuth = ({
  adminUsers,
  setAdminUsers,
  setIsAuthenticated,
  setCurrentUser,
  currentUser
}: UseAdminAuthProps) => {
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = (username: string, password: string): boolean => {
    setLoginError(null);
    console.log('Admin auth: Attempting login with username:', username);
    console.log('Admin auth: Available users:', adminUsers.map(u => u.username));
    
    try {
      // Case insensitive username comparison but case sensitive password
      const foundUser = adminUsers.find(
        user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );
      
      if (foundUser) {
        console.log('Admin auth: Login successful for user:', foundUser.username, 'with role:', foundUser.role);
        
        // Create updated user with login timestamp
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString()
        };
        
        // Update authentication state
        setIsAuthenticated(true);
        setCurrentUser(updatedUser);
        
        // Store session info in localStorage - both formats for compatibility
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', foundUser.username);
        localStorage.setItem('admin-user', JSON.stringify(updatedUser));
        
        // Also update the user in the adminUsers array
        updateAdminUser(foundUser.username, { lastLogin: updatedUser.lastLogin });
        
        return true;
      } else {
        console.log('Admin auth: Login failed: Invalid credentials');
        console.log('Admin auth: Attempted username:', username);
        console.log('Admin auth: Available usernames:', adminUsers.map(u => u.username));
        setLoginError('Invalid username or password');
        toast.error('Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Admin auth: Login error:', error);
      setLoginError('An error occurred during login');
      toast.error('An error occurred during login');
      return false;
    }
  };
  
  const logout = () => {
    console.log('Admin auth: Logging out');
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin-user');
    toast.info('You have been logged out');
  };
  
  const addAdmin = (username: string, password: string, permissions: AdminPermissions = defaultPermissions) => {
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }
    
    if (adminUsers.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      toast.error('Admin user already exists');
      return;
    }
    
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
    toast.success(`Admin user '${username}' added successfully`);
  };
  
  const removeAdmin = (username: string) => {
    if (username.toLowerCase() === 'admin') {
      toast.error('Cannot remove the main admin account');
      return;
    }
    
    const updatedUsers = adminUsers.filter(user => user.username !== username);
    setAdminUsers(updatedUsers);
    localStorage.setItem('admin-users', JSON.stringify(updatedUsers));
    toast.success(`Admin user '${username}' removed successfully`);
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
    
    toast.success(`Permissions updated for '${username}'`);
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
  
  return {
    login,
    logout,
    loginError,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminUser
  };
};
