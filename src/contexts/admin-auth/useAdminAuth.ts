
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { testCredentials, defaultAdminUsers } from './constants';
import { AdminUser, AdminRole, AdminPermissions } from './types';
import { isSuperAdmin as checkIsSuperAdmin, hasPermission as checkHasPermission } from '@/components/admin/utils/permissionUtils';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);

  // Helper function to create AdminUser objects with all required properties
  const createAdminUser = (userData: Partial<AdminUser> & { id: string; email: string; username: string; role: AdminRole }): AdminUser => {
    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      role: userData.role,
      permissions: userData.permissions || {
        canManageUsers: true,
        canManageExperts: true,
        canManageContent: true,
        canViewAnalytics: true,
        canManageServices: true,
        canManagePrograms: true,
        canDeleteContent: true,
        canApproveExperts: true,
        canManageBlog: true,
        canManageTestimonials: true
      },
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLogin: userData.lastLogin || new Date().toISOString(),
      isActive: userData.isActive ?? true // Fixed: added isActive property
    };
  };

  // Initialize authentication state from local storage or session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session in localStorage
        const storedUserData = localStorage.getItem('admin_auth');
        
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
        
        // Also check Supabase session
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          // Here you would typically fetch admin user data based on the auth session
          // For now we're using mock data
          console.log('Found Supabase session:', data.session.user.email);
        }
      } catch (error) {
        console.error('Error checking admin auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    console.log(`AdminAuth: Login attempt for ${usernameOrEmail}`);
    
    try {
      // Only allow IFLsuperadmin to login
      if (usernameOrEmail.toLowerCase() !== testCredentials.iflsuperadmin.username.toLowerCase()) {
        console.log('AdminAuth: Invalid credentials - only IFLsuperadmin is allowed');
        return false;
      }
      
      if (password !== testCredentials.iflsuperadmin.password) {
        console.log('AdminAuth: Invalid password for IFLsuperadmin');
        return false;
      }
      
      // Find the admin user from our default list
      const adminUser = defaultAdminUsers.find(user => 
        user.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
        user.email.toLowerCase() === usernameOrEmail.toLowerCase()
      );
      
      if (adminUser) {
        // Create a complete admin user object
        const completeAdminUser = createAdminUser({
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          role: adminUser.role,
          permissions: adminUser.permissions,
          createdAt: adminUser.createdAt,
          lastLogin: new Date().toISOString(),
          isActive: true // Added isActive property
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('admin_auth', JSON.stringify(completeAdminUser));
        
        // Update state
        setCurrentUser(completeAdminUser);
        setIsAuthenticated(true);
        
        console.log('AdminAuth: Login successful');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('AdminAuth: Login error:', error);
      return false;
    }
  };

  // Logout function 
  const logout = async (): Promise<boolean> => {
    try {
      localStorage.removeItem('admin_auth');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (error) {
      console.error('AdminAuth: Logout error:', error);
      return false;
    }
  };

  // Check if user is a super admin (works both as a function and property)
  const isSuperAdmin = useCallback((user?: AdminUser | null): boolean => {
    // If no user is provided, check current user
    const userToCheck = user || currentUser;
    if (!userToCheck) return false;
    
    return checkIsSuperAdmin(userToCheck);
  }, [currentUser]);

  // Check if user has permission
  const hasPermission = useCallback((user: AdminUser | null, permission: keyof AdminPermissions): boolean => {
    if (!user) return false;
    return checkHasPermission(user, permission);
  }, []);

  // Get admin by ID
  const getAdminById = useCallback((id: string): AdminUser | null => {
    const admin = adminUsers.find(a => a.id === id);
    return admin || null;
  }, [adminUsers]);

  // Add a new admin
  const addAdmin = useCallback((adminData: Partial<AdminUser>): void => {
    if (!adminData.username || !adminData.email) {
      console.error('AdminAuth: Cannot add admin without username and email');
      return;
    }
    
    const newAdmin = createAdminUser({
      id: `admin_${Date.now()}`,
      email: adminData.email,
      username: adminData.username,
      role: adminData.role || 'admin',
      permissions: adminData.permissions,
      createdAt: adminData.createdAt,
      lastLogin: adminData.lastLogin,
      isActive: adminData.isActive ?? true // Fixed: added isActive property with default
    });
    
    setAdminUsers(prev => [...prev, newAdmin]);
  }, []);

  // Remove an admin
  const removeAdmin = useCallback((adminId: string): void => {
    setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
  }, []);

  // Update admin permissions
  const updateAdminPermissions = useCallback((adminId: string, permissions: AdminPermissions): void => {
    setAdminUsers(prev => 
      prev.map(admin => 
        admin.id === adminId 
          ? { ...admin, permissions } 
          : admin
      )
    );
    
    // If updating current user, update current user as well
    if (currentUser && currentUser.id === adminId) {
      setCurrentUser(prev => prev ? { ...prev, permissions } : null);
    }
  }, [currentUser]);

  // Update admin role
  const updateAdminRole = useCallback((adminId: string, role: AdminRole): boolean => {
    let success = false;
    
    setAdminUsers(prev => {
      const updated = prev.map(admin => {
        if (admin.id === adminId) {
          success = true;
          return { ...admin, role };
        }
        return admin;
      });
      return updated;
    });
    
    // If updating current user, update current user as well
    if (success && currentUser && currentUser.id === adminId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
    
    return success;
  }, [currentUser]);

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    login,
    logout,
    adminUsers,
    isSuperAdmin,
    hasPermission,
    getAdminById,
    addAdmin,
    removeAdmin,
    updateAdminPermissions,
    updateAdminRole
  };
};
