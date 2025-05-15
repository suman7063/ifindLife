
import { createContext } from 'react';

export type AdminRole = 'admin' | 'superadmin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: AdminUser | null;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isSuperAdmin: boolean;
}

export const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  error: null,
  login: async () => false,
  logout: async () => false,
  isSuperAdmin: false
});

export const useAdminAuth = () => {
  // This is just a placeholder - the actual hook will be imported from useAdminAuth.ts
  return {} as AdminAuthContextType;
};
