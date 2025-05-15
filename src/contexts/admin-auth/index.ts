
// Re-export the components from the admin auth context
export { AdminAuthContext } from './AdminAuthContext';
export { AdminAuthProvider } from './AdminAuthProvider';
export { useAuth } from './useAdminAuth'; 
export type { 
  AdminUser, 
  AdminRole, 
  AdminPermissions,
  AdminAuthContextType
} from './types';
