
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define types for AdminUser and related interfaces
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  permissions: AdminPermissions;
  lastLogin?: string;
  createdAt?: string;
}

export type AdminRole = 'admin' | 'superadmin';

export interface AdminPermissions {
  canManageUsers?: boolean;
  canManageExperts?: boolean;
  canManageContent?: boolean;
  canManageServices?: boolean;
  canManagePrograms?: boolean;
  canViewAnalytics?: boolean;
  canDeleteContent?: boolean;
  canApproveExperts?: boolean;
  canManageBlog?: boolean;
  canManageTestimonials?: boolean;
}

export interface AdminAuthContextType {
  // User and session state
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  
  // Role checking
  checkRole: (role: AdminRole) => boolean;
  
  // Legacy properties (for backward compatibility)
  currentUser: AdminUser | null;
  isSuperAdmin: (user: AdminUser | null) => boolean;
  adminUsers: AdminUser[];
  permissions: AdminPermissions;
  isLoading: boolean;
  
  // Admin user management
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  removeAdmin: (adminId: string) => void;
  updateAdminPermissions: (adminId: string, permissions: Partial<AdminPermissions>) => void;
  hasPermission: (user: AdminUser | null, permission: keyof AdminPermissions) => boolean;
  getAdminById: (id: string) => AdminUser | undefined;
  updateAdminRole: (adminId: string, role: AdminRole) => void;
}

// Create the context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Hook to use the admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Default admin users for demo purposes
const defaultAdminUsers: AdminUser[] = [
  {
    id: 'admin_1',
    username: 'admin',
    email: 'admin@ifindlife.com',
    role: 'superadmin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: true,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    },
    lastLogin: new Date().toISOString()
  },
  {
    id: 'admin_2',
    username: 'superadmin',
    email: 'superadmin@ifindlife.com',
    role: 'superadmin',
    permissions: {
      canManageUsers: true,
      canManageExperts: true,
      canManageContent: true,
      canManageServices: true,
      canManagePrograms: true,
      canViewAnalytics: true,
      canDeleteContent: true,
      canApproveExperts: true,
      canManageBlog: true,
      canManageTestimonials: true
    }
  }
];

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);

  // Check for existing admin session
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        const sessionExpiry = localStorage.getItem('adminSessionExpiry');
        
        if (storedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            const adminUser = JSON.parse(storedUser);
            setUser(adminUser);
          } else {
            // Session expired
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminSessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AdminAuth: Attempting login for:', username);
      setLoading(true);
      setError(null);
      
      // Simple credential check - in production, this should be against your backend
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' as const },
        { username: 'superadmin', password: 'super123', role: 'superadmin' as const },
        { username: 'test', password: 'test', role: 'admin' as const }
      ];
      
      const credential = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (credential) {
        const adminUser: AdminUser = {
          id: `admin_${credential.username}`,
          username: credential.username,
          email: `${credential.username}@ifindlife.com`,
          role: credential.role,
          permissions: credential.role === 'superadmin' ? {
            canManageUsers: true,
            canManageExperts: true,
            canManageContent: true,
            canManageServices: true,
            canManagePrograms: true,
            canViewAnalytics: true,
            canDeleteContent: true,
            canApproveExperts: true,
            canManageBlog: true,
            canManageTestimonials: true
          } : {
            canManageUsers: false,
            canManageExperts: true,
            canManageContent: true,
            canManageServices: true,
            canManagePrograms: true,
            canViewAnalytics: true,
            canDeleteContent: false,
            canApproveExperts: false,
            canManageBlog: true,
            canManageTestimonials: true
          },
          lastLogin: new Date().toISOString()
        };
        
        // Set session expiry (24 hours)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminSessionExpiry', expiryTime.toString());
        
        setUser(adminUser);
        
        console.log('AdminAuth: Login successful for:', username);
        toast.success('Admin login successful');
        return true;
      } else {
        console.log('AdminAuth: Invalid credentials for:', username);
        toast.error('Invalid admin credentials');
        return false;
      }
    } catch (error) {
      console.error('AdminAuth: Login error:', error);
      setError(error as Error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminSessionExpiry');
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('AdminAuth: Logout error:', error);
      toast.error('Logout failed');
      return false;
    }
  };

  const checkRole = (role: AdminRole): boolean => {
    return user?.role === role || user?.role === 'superadmin';
  };

  const isSuperAdmin = (user: AdminUser | null): boolean => {
    return user?.role === 'superadmin';
  };

  const hasPermission = (user: AdminUser | null, permission: keyof AdminPermissions): boolean => {
    if (!user) return false;
    if (isSuperAdmin(user)) return true;
    return user.permissions[permission] === true;
  };

  const addAdmin = (adminData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin: AdminUser = {
      ...adminData,
      id: `admin_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAdminUsers(prev => [...prev, newAdmin]);
  };

  const removeAdmin = (adminId: string) => {
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
  };

  const updateAdminPermissions = (adminId: string, permissions: Partial<AdminPermissions>) => {
    setAdminUsers(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, permissions: { ...admin.permissions, ...permissions } }
        : admin
    ));
  };

  const getAdminById = (id: string): AdminUser | undefined => {
    return adminUsers.find(admin => admin.id === id);
  };

  const updateAdminRole = (adminId: string, role: AdminRole) => {
    setAdminUsers(prev => prev.map(admin => 
      admin.id === adminId ? { ...admin, role } : admin
    ));
  };

  const value: AdminAuthContextType = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkRole,
    
    // Legacy properties
    currentUser: user,
    isSuperAdmin,
    adminUsers,
    permissions: user?.permissions || {},
    isLoading: loading,
    
    // Admin user management
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    hasPermission,
    getAdminById,
    updateAdminRole
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
