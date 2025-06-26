
import React from 'react';
// Updated import path to fix the error
import { AdminAuthProvider as ActualAdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';

// This file is a temporary compatibility layer that redirects imports from old path to new path
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ActualAdminAuthProvider>{children}</ActualAdminAuthProvider>;
};

export default AdminAuthProvider;
