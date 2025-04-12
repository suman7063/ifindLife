
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
    // Clear any existing sessions to start fresh
    const adminSession = localStorage.getItem('admin_session');
    const adminUsername = localStorage.getItem('admin_username');
    
    console.log('Checking admin session:', adminSession, 'username:', adminUsername);
    
    if (adminSession === 'true' && adminUsername) {
      // Find the user in adminUsers
      const foundUser = adminUsers.find(user => user.username === adminUsername);
      
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
  }, []);

  // Simple admin authentication
  const login = (username: string, password: string): boolean => {
    console.log('Login attempt for username:', username);
    
    // Case insensitive username check, but case sensitive password
    const foundUser = adminUsers.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    const correctPassword = 'Freesoul@99';
    
    console.log('Found user in database:', !!foundUser);
    console.log('Password check:', password === correctPassword);
    
    if (foundUser && password === correctPassword) {
      console.log('Login successful - setting local storage');
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_username', foundUser.username); // Store with correct case
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
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
