
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
      const foundUser = adminUsers.find(
        user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );
      
      if (foundUser) {
        console.log('Admin auth: Login successful for user:', foundUser.username);
        setIsAuthenticated(true);
        setCurrentUser(foundUser);
        
        // Store session info in localStorage
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', foundUser.username);
        localStorage.setItem('admin-user', JSON.stringify(foundUser));
        
        return true;
      } else {
        console.log('Admin auth: Login failed: Invalid credentials');
        setLoginError('Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Admin auth: Login error:', error);
      setLoginError('An error occurred during login');
      return false;
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
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
      permissions
    };
    
    setAdminUsers(prev => [...prev, newUser]);
    toast.success(`Admin user '${username}' added successfully`);
  };
  
  const removeAdmin = (username: string) => {
    if (username.toLowerCase() === 'admin') {
      toast.error('Cannot remove the main admin account');
      return;
    }
    
    setAdminUsers(prev => prev.filter(user => user.username !== username));
    toast.success(`Admin user '${username}' removed successfully`);
  };
  
  const updateAdminPermissions = (username: string, permissions: AdminPermissions) => {
    setAdminUsers(prev => prev.map(user => 
      user.username === username 
        ? { ...user, permissions } 
        : user
    ));
    
    // If we're updating the current user, also update the current user state
    if (currentUser && currentUser.username === username) {
      setCurrentUser({ ...currentUser, permissions });
    }
    
    toast.success(`Permissions updated for '${username}'`);
  };
  
  return {
    login,
    logout,
    loginError,
    addAdmin,
    removeAdmin,
    updateAdminPermissions
  };
};
