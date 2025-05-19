
import React, { useState, useEffect, ReactNode } from 'react';
import { AdminAuthContext } from './AdminAuthContext';
import { AdminUser, initialAuthState } from './types';
import { defaultAdminUsers } from './constants';
import { useAdminSession } from './hooks/useAdminSession';
import { useAdminAuth } from './hooks/useAdminAuth';
import { usePermissions } from './hooks/usePermissions';

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Session management hook
  const sessionData = useAdminSession();
  
  // Authentication hook
  const authActions = useAdminAuth();
  
  // Sync session state with our component state
  useEffect(() => {
    setUser(sessionData.user);
    setIsAuthenticated(sessionData.isAuthenticated);
    setLoading(sessionData.loading);
    setError(sessionData.error);
  }, [
    sessionData.user, 
    sessionData.isAuthenticated, 
    sessionData.loading, 
    sessionData.error
  ]);
  
  // Permissions hook
  const permissionsActions = usePermissions(user);

  // Computed values
  const adminUsers = user 
    ? [user, ...defaultAdminUsers.filter(u => u.id !== user.id)] 
    : defaultAdminUsers;
  
  const permissions = user?.permissions || {};

  // Map legacy property names to new properties
  const currentUser = user;
  const isLoading = loading;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session: sessionData.session,
        loading,
        error,
        isAuthenticated,
        login: authActions.login,
        logout: authActions.logout,
        checkRole: permissionsActions.checkRole,
        // Legacy properties for backward compatibility
        currentUser,
        isSuperAdmin: permissionsActions.isSuperAdmin,
        adminUsers,
        addAdmin: permissionsActions.addAdmin,
        removeAdmin: permissionsActions.removeAdmin,
        updateAdminPermissions: permissionsActions.updateAdminPermissions,
        hasPermission: permissionsActions.hasPermission,
        getAdminById: permissionsActions.getAdminById,
        updateAdminRole: permissionsActions.updateAdminRole,
        permissions,
        isLoading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
