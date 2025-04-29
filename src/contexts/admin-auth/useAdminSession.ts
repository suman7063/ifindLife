
import { useState, useEffect } from 'react';
import { AdminUser } from './types';
import { defaultAdminUsers } from './constants';

export const useAdminSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  // Check for existing admin session on component mount
  useEffect(() => {
    try {
      console.log('AuthProvider: Checking for existing session');
      const adminSession = localStorage.getItem('admin_session');
      const adminUsername = localStorage.getItem('admin_username');
      
      console.log('AuthProvider session check:', { adminSession, adminUsername });
      
      if (adminSession === 'true' && adminUsername) {
        // Find the user in adminUsers
        const foundUser = adminUsers.find(user => user.username.toLowerCase() === adminUsername.toLowerCase());
        
        if (foundUser) {
          console.log('AuthProvider: Found authenticated user:', foundUser);
          setIsAuthenticated(true);
          setCurrentUser(foundUser);
        } else {
          console.log('AuthProvider: No matching user found, clearing session');
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_username');
        }
      }
    } catch (err) {
      console.error('Error checking admin session:', err);
    }
  }, []);

  return {
    isAuthenticated, 
    setIsAuthenticated,
    adminUsers,
    setAdminUsers,
    currentUser,
    setCurrentUser
  };
};
