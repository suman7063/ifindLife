
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

  // Simple admin authentication with enhanced debugging and FIXED PASSWORD COMPARISON
  const login = (username: string, password: string): boolean => {
    console.log('----- ADMIN LOGIN ATTEMPT -----');
    console.log('Login attempt details:');
    
    // Debug Log - Raw input values
    console.log('Raw username input:', username);
    console.log('Raw password input:', password ? '******' : 'empty');
    console.log('Raw password length:', password ? password.length : 0);
    
    // Fixed credentials for admin access 
    const expectedUsername = 'Soultribe';
    const expectedPassword = 'Freesoul@99';
    
    // Debug Log - Expected values
    console.log('Expected username:', expectedUsername);
    console.log('Expected password:', '*'.repeat(expectedPassword.length));
    console.log('Expected password length:', expectedPassword.length);
    
    // Trim and normalize inputs for comparison
    const normalizedInputUsername = username ? username.trim() : '';
    const normalizedInputPassword = password ? password : '';
    
    // Debug Log - Processed inputs
    console.log('Normalized input username:', normalizedInputUsername);
    console.log('Normalized input password length:', normalizedInputPassword.length);
    
    // Extra debug log - First and last characters
    console.log('Expected first 3 chars (masked):', expectedPassword.substring(0, 3));
    console.log('Input first 3 chars (masked):', normalizedInputPassword.substring(0, 3));
    console.log('Expected last 3 chars (masked):', expectedPassword.substring(expectedPassword.length - 3));
    console.log('Input last 3 chars (masked):', normalizedInputPassword.substring(normalizedInputPassword.length - 3));
    
    // USERNAME CHECK: Case-insensitive comparison
    const usernameMatches = normalizedInputUsername.toLowerCase() === expectedUsername.toLowerCase();
    
    // PASSWORD CHECK: Direct string comparison (case-sensitive)
    // FIX: Ensure exact string comparison and log its result
    const passwordMatches = normalizedInputPassword === expectedPassword;
    
    // Debug Log - Match results
    console.log('Username comparison (case-insensitive):', 
      `'${normalizedInputUsername.toLowerCase()}' === '${expectedUsername.toLowerCase()}'`);
    console.log('Username matches:', usernameMatches);
    console.log('Password comparison result:', passwordMatches);
    
    // Character-by-character debug for password
    if (!passwordMatches && normalizedInputPassword && expectedPassword) {
      console.log('Password character-by-character comparison:');
      const maxLength = Math.max(normalizedInputPassword.length, expectedPassword.length);
      
      for (let i = 0; i < maxLength; i++) {
        const inputChar = i < normalizedInputPassword.length ? normalizedInputPassword[i] : '[missing]';
        const expectedChar = i < expectedPassword.length ? expectedPassword[i] : '[missing]';
        const matches = inputChar === expectedChar;
        
        console.log(`Position ${i}: Input '${inputChar}' vs Expected '${expectedChar}' - ${matches ? 'Match' : 'MISMATCH'}`);
      }
    }
    
    // Check for whitespace or invisible characters in password
    if (!passwordMatches) {
      console.log('Input password code points:', Array.from(normalizedInputPassword).map(char => char.charCodeAt(0)));
      console.log('Expected password code points:', Array.from(expectedPassword).map(char => char.charCodeAt(0)));
    }
    
    // Final authentication decision - FOCUS ON EXACT STRING COMPARISON
    if (usernameMatches && passwordMatches) {
      console.log('Login successful - setting local storage');
      try {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', expectedUsername); // Always store correct case
        setIsAuthenticated(true);
        setCurrentUser({ username: expectedUsername, role: 'superadmin' });
        console.log('Authentication state updated:', { isAuthenticated: true, currentUser: { username: expectedUsername, role: 'superadmin' }});
        return true;
      } catch (err) {
        console.error('Error saving to localStorage:', err);
        // Still allow login even if localStorage fails
        setIsAuthenticated(true);
        setCurrentUser({ username: expectedUsername, role: 'superadmin' });
        console.log('Authentication state updated (localStorage failed):', { isAuthenticated: true, currentUser: { username: expectedUsername, role: 'superadmin' }});
        return true;
      }
    } else {
      // Authentication failed
      console.error('Authentication failed:');
      console.error('- Username match:', usernameMatches);
      console.error('- Password match:', passwordMatches);
      
      if (!usernameMatches) {
        console.error(`- Username mismatch detected. Got "${normalizedInputUsername}" (normalized to "${normalizedInputUsername.toLowerCase()}"), expected "${expectedUsername}" (normalized to "${expectedUsername.toLowerCase()}")`);
      }
      
      if (!passwordMatches) {
        console.error(`- Password mismatch detected. Got length ${normalizedInputPassword.length}, expected length ${expectedPassword.length}`);
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
  
  // Admin user management functions
  const addAdmin = (username: string, password: string): boolean => {
    if (!currentUser || currentUser.role !== 'superadmin') return false;
    
    // Check if username already exists
    if (adminUsers.some(user => user.username === username)) {
      return false;
    }
    
    // In a real app, you would securely store the password
    const newUser: AdminUser = {
      username,
      role: 'admin' // New users are regular admins
    };
    
    // Fix: Create a new array with the new user added (instead of using a callback)
    const updatedUsers = [...adminUsers, newUser];
    setAdminUsers(updatedUsers);
    return true;
  };
  
  const removeAdmin = (username: string): boolean => {
    if (!currentUser || currentUser.role !== 'superadmin') return false;
    
    // Can't remove superadmin
    if (adminUsers.find(user => user.username === username)?.role === 'superadmin') {
      return false;
    }
    
    // Fix: Create a new filtered array (instead of using a callback)
    const updatedUsers = adminUsers.filter(user => user.username !== username);
    setAdminUsers(updatedUsers);
    return true;
  };

  return {
    login,
    logout,
    addAdmin,
    removeAdmin
  };
};
