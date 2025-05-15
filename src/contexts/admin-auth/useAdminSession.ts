
import { useState, useEffect } from 'react';
import { AdminUser, initialAdminAuthState } from './types';
import { defaultAdminUsers } from './constants';

export const useAdminSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize session state from local storage on mount
  useEffect(() => {
    try {
      setIsLoading(true);

      // Check if there's a stored admin session
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as AdminUser;
          
          // Find the user in the admin users list to get the latest permissions
          const userWithLatestData = adminUsers.find(u => u.id === parsedUser.id) || parsedUser;
          
          setCurrentUser(userWithLatestData);
          setIsAuthenticated(true);
          console.log('Admin session restored for:', userWithLatestData.username);
        } catch (e) {
          console.error('Error parsing stored admin user:', e);
          localStorage.removeItem('adminUser');
          setError(new Error('Invalid stored session'));
        }
      }
    } catch (e) {
      console.error('Error initializing admin session:', e);
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    adminUsers,
    setAdminUsers,
    currentUser,
    setCurrentUser,
    isLoading,
    error
  };
};
