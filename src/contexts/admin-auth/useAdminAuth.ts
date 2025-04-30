
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
    
    try {
      const foundUser = adminUsers.find(
        user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );
      
      if (foundUser) {
        console.log('Login successful for user:', foundUser);
        setIsAuthenticated(true);
        setCurrentUser(foundUser);
        
        // Store session info in localStorage
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', foundUser.username);
        
        return true;
      } else {
        console.log('Login failed: Invalid credentials');
        setLoginError('Invalid username or password');
        toast.error('Invalid username or password', {
          description: 'Please check your credentials and try again',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
      toast.error('Login error', {
        description: 'An error occurred during the login process',
      });
      return false;
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
    toast.success('Logged out successfully', {
      description: 'You have been logged out of the admin panel',
    });
  };
  
  const addAdmin = (username: string, password: string, permissions: AdminPermissions = defaultPermissions) => {
    if (!username || !password) {
      toast.error('Validation failed', {
        description: 'Username and password are required',
      });
      return;
    }
    
    if (adminUsers.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      toast.error('Admin already exists', {
        description: `Admin user '${username}' already exists`,
      });
      return;
    }
    
    const newUser: AdminUser = {
      username,
      password,
      role: 'admin',
      permissions
    };
    
    setAdminUsers(prev => [...prev, newUser]);
    toast.success('Admin user added', {
      description: `Admin user '${username}' was added successfully`,
    });
  };
  
  const removeAdmin = (username: string) => {
    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'iflsuperadmin') {
      toast.error('Cannot remove user', {
        description: 'Cannot remove protected admin account',
      });
      return;
    }
    
    setAdminUsers(prev => prev.filter(user => user.username !== username));
    toast.success('Admin user removed', {
      description: `Admin user '${username}' was removed successfully`,
    });
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
    
    toast.success('Permissions updated', {
      description: `Permissions for '${username}' were updated successfully`,
    });
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
