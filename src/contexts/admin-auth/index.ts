
// Re-export the components from the admin auth context
export { AdminAuthContext, useAuth } from './AdminAuthContext';
export { AdminAuthProvider } from './AdminAuthProvider';

// Re-export the types
export type { 
  AdminAuthContextType,
  AdminUser,
  AdminPermissions,
  AdminRole
} from './types';
