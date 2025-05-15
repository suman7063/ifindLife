
import { Session } from '@supabase/supabase-js';

export type AdminRole = 'admin' | 'super_admin' | 'content_editor' | 'support';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export interface AdminAuthState {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AdminAuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

export interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkRole: (requiredRole: AdminRole | AdminRole[]) => boolean;
}
