
import React from 'react';
import { AdminAuthProvider as ActualAdminAuthProvider } from './AdminAuthContext';

// This is the main AdminAuthProvider that should be used throughout the app
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ActualAdminAuthProvider>{children}</ActualAdminAuthProvider>;
};

export default AdminAuthProvider;
