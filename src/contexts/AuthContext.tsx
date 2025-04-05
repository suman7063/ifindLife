
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  username: string;
  role: 'admin' | 'superadmin';
};

type AuthContextType = {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  adminUsers: User[];
  addAdmin: (username: string, password: string) => boolean;
  removeAdmin: (username: string) => void;
  isSuperAdmin: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin user type with password
type AdminUserWithPassword = {
  username: string;
  password: string;
  role: 'admin' | 'superadmin';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserWithPassword[]>([
    { username: 'Soultribe', password: 'Freesoul@99', role: 'superadmin' as const }
  ]);
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  // Check for stored authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('ifindlife-auth');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        // Reset last activity timestamp when restoring session
        setLastActivity(Date.now());
      } catch (e) {
        localStorage.removeItem('ifindlife-auth');
      }
    }

    // Load any saved admin users from localStorage
    const storedAdmins = localStorage.getItem('ifindlife-admins');
    if (storedAdmins) {
      try {
        const parsedAdmins = JSON.parse(storedAdmins);
        // Make sure the superadmin is always included
        const hasSuperAdmin = parsedAdmins.some((admin: AdminUserWithPassword) => 
          admin.username === 'Soultribe' && admin.role === 'superadmin'
        );
        
        if (!hasSuperAdmin) {
          parsedAdmins.push({ username: 'Soultribe', password: 'Freesoul@99', role: 'superadmin' });
        }
        
        setAdminUsers(parsedAdmins);
      } catch (e) {
        console.error("Error loading admin users:", e);
      }
    } else {
      // Initialize localStorage with default admin
      localStorage.setItem('ifindlife-admins', JSON.stringify(adminUsers));
    }
  }, []);

  // Admin session timeout check
  useEffect(() => {
    if (!currentUser) return;

    // Reset the activity timer on user interaction
    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity 
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);

    // Check session timeout every minute
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        // Session timed out, log out
        console.log('Admin session timeout reached');
        toast.warning('Your session has expired due to inactivity.');
        logout();
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearInterval(interval);
    };
  }, [currentUser, lastActivity]);

  const login = (username: string, password: string): boolean => {
    const user = adminUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      const userData = { username: user.username, role: user.role };
      setCurrentUser(userData);
      localStorage.setItem('ifindlife-auth', JSON.stringify(userData));
      setLastActivity(Date.now());
      toast.success(`Welcome back, ${user.username}!`);
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ifindlife-auth');
    navigate('/admin-login');
    toast.info('You have been logged out');
  };

  const addAdmin = (username: string, password: string): boolean => {
    // Check if username already exists
    if (adminUsers.some(user => user.username === username)) {
      toast.error('Username already exists');
      return false;
    }

    // Add new admin
    const newAdmin: AdminUserWithPassword = {
      username,
      password,
      role: 'admin' // New users are always regular admins
    };

    const updatedAdmins = [...adminUsers, newAdmin];
    setAdminUsers(updatedAdmins);
    localStorage.setItem('ifindlife-admins', JSON.stringify(updatedAdmins));
    toast.success(`Admin "${username}" added successfully`);
    return true;
  };

  const removeAdmin = (username: string) => {
    // Don't allow removing the superadmin
    if (username === 'Soultribe') {
      toast.error('Cannot remove superadmin');
      return;
    }

    const updatedAdmins = adminUsers.filter(user => user.username !== username);
    setAdminUsers(updatedAdmins);
    localStorage.setItem('ifindlife-admins', JSON.stringify(updatedAdmins));
    toast.success(`Admin "${username}" removed`);
  };

  // Derived state for checking if current user is a superadmin
  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        adminUsers: adminUsers.map(({ username, role }) => ({ username, role })),
        addAdmin,
        removeAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
