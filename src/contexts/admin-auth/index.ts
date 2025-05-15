
// Re-export the components from the admin auth context
export { AdminAuthContext } from './AdminAuthContext';
export { AdminAuthProvider } from './AdminAuthProvider';
export type { AdminAuthContextType } from './types';
export type { AdminUser, AdminPermissions } from './types';

// Re-export the auth hook for convenience
export { useAuth } from './AdminAuthContext';
