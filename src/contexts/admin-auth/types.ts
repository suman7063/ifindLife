
// Re-export types from AdminAuthContext to avoid circular dependencies
import { AdminPermissions, AdminUser } from './AdminAuthContext';

export type { AdminPermissions, AdminUser };

export interface AdminSession {
  id: string;
  created_at: string;
  expires_at: string;
}
