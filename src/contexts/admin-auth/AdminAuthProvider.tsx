
import React from 'react';
import { AdminAuthProvider as Provider } from './AdminAuthContext';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export { useAdminAuth as useAuth } from './AdminAuthContext';
