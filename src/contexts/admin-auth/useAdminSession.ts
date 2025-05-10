
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
      
      // First check for the stored user object which has more data
      const storedUser = localStorage.getItem('admin-user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('AuthProvider: Found stored user data:', parsedUser.username);
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
          return;
        } catch (error) {
          console.error('Error parsing stored admin user:', error);
          localStorage.removeItem('admin-user');
        }
      }
      
      // Fall back to the older session storage method
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
          
          // Update to new storage format
          localStorage.setItem('admin-user', JSON.stringify(foundUser));
        } else {
          console.log('AuthProvider: No matching user found, clearing session');
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_username');
        }
      }
    } catch (err) {
      console.error('Error checking admin session:', err);
    }
  }, [adminUsers]);

  return {
    isAuthenticated, 
    setIsAuthenticated,
    adminUsers,
    setAdminUsers,
    currentUser,
    setCurrentUser
  };
};
