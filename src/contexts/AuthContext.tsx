import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AdminUser {
  username: string;
  role: 'admin' | 'superadmin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsers: AdminUser[];
  addAdmin: (username: string, password: string) => boolean;
  removeAdmin: (username: string) => boolean;
  isSuperAdmin: boolean;
  currentUser: AdminUser | null;
}

const defaultAdminUsers: AdminUser[] = [
  { username: 'Soultribe', role: 'superadmin' }
];

const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  adminUsers: defaultAdminUsers,
  addAdmin: () => false,
  removeAdmin: () => false,
  isSuperAdmin: false,
  currentUser: null
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  // Simple admin authentication with enhanced debugging and FIXED PASSWORD COMPARISON
  const login = (username: string, password: string): boolean => {
    console.log('----- ADMIN LOGIN ATTEMPT -----');
    console.log('Login attempt details:');
    
    // Debug Log - Raw input values
    console.log('Raw username input:', username);
    console.log('Raw password input:', password);
    console.log('Raw password length:', password ? password.length : 0);
    
    // Fixed credentials for admin access 
    const expectedUsername = 'Soultribe';
    const expectedPassword = 'Freesoul@99';
    
    // Debug Log - Expected values
    console.log('Expected username:', expectedUsername);
    console.log('Expected password:', expectedPassword);
    console.log('Expected password length:', expectedPassword.length);
    
    // Trim and normalize inputs for comparison
    const normalizedInputUsername = username ? username.trim() : '';
    const normalizedInputPassword = password ? password : '';
    
    // Debug Log - Processed inputs
    console.log('Normalized input username:', normalizedInputUsername);
    console.log('Normalized input password length:', normalizedInputPassword.length);
    
    // USERNAME CHECK: Case-insensitive comparison
    const usernameMatches = normalizedInputUsername.toLowerCase() === expectedUsername.toLowerCase();
    
    // PASSWORD CHECK: Direct string comparison (case-sensitive)
    // FIX: Ensure exact string comparison
    const passwordMatches = normalizedInputPassword === expectedPassword;
    
    // Debug Log - Match results
    console.log('Username comparison (case-insensitive):', 
      `'${normalizedInputUsername.toLowerCase()}' === '${expectedUsername.toLowerCase()}'`);
    console.log('Username matches:', usernameMatches);
    console.log('Password matches:', passwordMatches);
    
    // Character-by-character debug for password (all characters)
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
    
    // Final authentication decision
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
    
    setAdminUsers(prev => [...prev, newUser]);
    return true;
  };
  
  const removeAdmin = (username: string): boolean => {
    if (!currentUser || currentUser.role !== 'superadmin') return false;
    
    // Can't remove superadmin
    if (adminUsers.find(user => user.username === username)?.role === 'superadmin') {
      return false;
    }
    
    setAdminUsers(prev => prev.filter(user => user.username !== username));
    return true;
  };
  
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      login,
      logout,
      adminUsers,
      addAdmin,
      removeAdmin,
      isSuperAdmin,
      currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
