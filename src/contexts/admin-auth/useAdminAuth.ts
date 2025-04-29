
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
    
    // Log the input and expected values (masking sensitive data)
    console.log(`Input username: "${username}"`);
    console.log(`Expected username: "${ADMIN_USERNAME}"`);
    console.log(`Input password length: ${password.length}`);
    console.log(`Expected password length: ${ADMIN_PASSWORD.length}`);
    
    // Direct comparison without any transformations
    const usernameMatches = username === ADMIN_USERNAME;
    const passwordMatches = password === ADMIN_PASSWORD;
    
    console.log(`Username exact match: ${usernameMatches}`);
    console.log(`Password exact match: ${passwordMatches}`);
    
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
      if (!usernameMatches) {
        console.log(`Username mismatch. Expected "${ADMIN_USERNAME}", got "${username}"`);
      }
      if (!passwordMatches) {
        console.log('Password mismatch');
        // Character by character comparison for debugging
        for (let i = 0; i < Math.max(password.length, ADMIN_PASSWORD.length); i++) {
          const inputChar = i < password.length ? password[i] : '[missing]';
          const expectedChar = i < ADMIN_PASSWORD.length ? ADMIN_PASSWORD[i] : '[missing]';
          const matches = inputChar === expectedChar;
          
          console.log(`Position ${i}: Input '${inputChar}' vs Expected '${expectedChar}' - ${matches ? 'Match' : 'MISMATCH'}`);
        }
      }
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
