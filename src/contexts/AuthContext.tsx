
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
      const adminSession = localStorage.getItem('admin_session');
      const adminUsername = localStorage.getItem('admin_username');
      
      console.log('Checking admin session:', adminSession, 'username:', adminUsername);
      
      if (adminSession === 'true' && adminUsername) {
        // Find the user in adminUsers
        const foundUser = adminUsers.find(user => user.username.toLowerCase() === adminUsername.toLowerCase());
        
        if (foundUser) {
          console.log('Found authenticated user:', foundUser);
          setIsAuthenticated(true);
          setCurrentUser(foundUser);
        } else {
          console.log('No matching user found, clearing session');
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_username');
        }
      }
    } catch (err) {
      console.error('Error checking admin session:', err);
    }
  }, []);

  // Simple admin authentication
  const login = (username: string, password: string): boolean => {
    console.log('Login attempt for username:', username);
    
    // Fixed credentials for admin access
    const expectedUsername = 'Soultribe';
    const expectedPassword = 'Freesoul@99';
    
    // Normalize the username for case-insensitive comparison
    const normalizedInputUsername = username.trim().toLowerCase();
    const normalizedExpectedUsername = expectedUsername.toLowerCase();
    
    // Username is case-insensitive, password is case-sensitive
    const usernameMatches = normalizedInputUsername === normalizedExpectedUsername;
    const passwordMatches = password === expectedPassword;
    
    console.log('Username matches:', usernameMatches, 'Input:', normalizedInputUsername, 'Expected:', normalizedExpectedUsername);
    console.log('Password matches:', passwordMatches);
    
    if (usernameMatches && passwordMatches) {
      console.log('Login successful - setting local storage');
      try {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_username', expectedUsername); // Always store correct case
        setIsAuthenticated(true);
        setCurrentUser({ username: expectedUsername, role: 'superadmin' });
        return true;
      } catch (err) {
        console.error('Error saving to localStorage:', err);
        // Still allow login even if localStorage fails
        setIsAuthenticated(true);
        setCurrentUser({ username: expectedUsername, role: 'superadmin' });
        return true;
      }
    } else {
      // Detailed error logging
      if (!usernameMatches) {
        console.error(`Username mismatch. Input: "${username}" (normalized: "${normalizedInputUsername}"), Expected: "${expectedUsername}" (normalized: "${normalizedExpectedUsername}")`);
      }
      if (!passwordMatches) {
        console.error('Password mismatch. Input length:', password.length, 'Expected length:', expectedPassword.length);
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
