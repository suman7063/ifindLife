
import { toast } from 'sonner';
import { AdminUser } from './types';

interface AdminAuthProps {
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;
  setIsAuthenticated: (value: boolean) => void;
  setCurrentUser: (user: AdminUser | null) => void;
  currentUser: AdminUser | null;
}

export const useAdminAuth = ({
  adminUsers,
  setAdminUsers,
  setIsAuthenticated,
  setCurrentUser,
  currentUser
}: AdminAuthProps) => {

  // Simplified admin authentication with clear credentials and detailed logging
  const login = (username: string, password: string): boolean => {
    console.log('----- ADMIN LOGIN ATTEMPT -----');
    
    // HARDCODED CREDENTIALS - these must match exactly what's used in AdminLogin.tsx
    const ADMIN_USERNAME = 'Soultribe';
    const ADMIN_PASSWORD = 'Freesoul@99';
    
    // Log the input and expected values
    console.log(`Input username: "${username}"`);
    console.log(`Expected username: "${ADMIN_USERNAME}"`);
    console.log(`Input password: "${password}"`);
    console.log(`Expected password: "${ADMIN_PASSWORD}"`);
    
    // Direct comparison using strict equality
    const usernameMatches = username === ADMIN_USERNAME;
    const passwordMatches = password === ADMIN_PASSWORD;
    
    console.log(`Username exact match: ${usernameMatches}`);
    console.log(`Password exact match: ${passwordMatches}`);
    
    // Debug character by character
    if (!passwordMatches) {
      console.log('Password mismatch - character by character check:');
      const maxLen = Math.max(password.length, ADMIN_PASSWORD.length);
      
      for (let i = 0; i < maxLen; i++) {
        const inputChar = i < password.length ? password[i] : '[missing]';
        const expectedChar = i < ADMIN_PASSWORD.length ? ADMIN_PASSWORD[i] : '[missing]';
        const matches = inputChar === expectedChar;
        
        console.log(`Position ${i}: Input '${inputChar}' vs Expected '${expectedChar}' - ${matches ? 'Match' : 'MISMATCH'}`);
        
        // Show character codes for deeper debugging
        if (!matches) {
          console.log(`  Input char code: ${inputChar !== '[missing]' ? inputChar.charCodeAt(0) : 'N/A'}`);
          console.log(`  Expected char code: ${expectedChar !== '[missing]' ? expectedChar.charCodeAt(0) : 'N/A'}`);
        }
      }
    }
    
    // If authentication passes, update state and localStorage
    if (usernameMatches && passwordMatches) {
      console.log('Authentication successful!');
      
      // Set authentication state
      setIsAuthenticated(true);
      setCurrentUser({ username: ADMIN_USERNAME, role: 'superadmin' });
      
      // Store in localStorage
      try {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', ADMIN_USERNAME);
        console.log('Session stored in localStorage');
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
      
      return true;
    } else {
      console.log('Authentication failed!');
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_username');
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  
  // Fix the admin user management functions to use proper typing
  const addAdmin = (username: string, password: string): boolean => {
    if (!currentUser || currentUser.role !== 'superadmin') return false;
    
    // Check if username already exists
    if (adminUsers.some(user => user.username === username)) {
      return false;
    }
    
    // Create a new admin user
    const newUser: AdminUser = {
      username,
      role: 'admin' // New users are regular admins
    };
    
    // Create a new array with the new user added
    setAdminUsers([...adminUsers, newUser]);
    return true;
  };
  
  const removeAdmin = (username: string): boolean => {
    if (!currentUser || currentUser.role !== 'superadmin') return false;
    
    // Can't remove superadmin
    if (adminUsers.find(user => user.username === username)?.role === 'superadmin') {
      return false;
    }
    
    // Create a new filtered array
    setAdminUsers(adminUsers.filter(user => user.username !== username));
    return true;
  };

  return {
    login,
    logout,
    addAdmin,
    removeAdmin
  };
};
