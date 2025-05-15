
import { User } from '@supabase/supabase-js';

export type AdminPermission = 
  | 'manage_users' 
  | 'manage_experts' 
  | 'manage_content'
  | 'manage_services'
  | 'manage_programs'
  | 'view_analytics'
  | 'delete_content'
  | 'approve_experts'
  | 'manage_blog'
  | 'manage_testimonials';

export const defaultPermissions: Record<string, AdminPermission[]> = {
  'superadmin': [
    'manage_users',
    'manage_experts',
    'manage_content',
    'manage_services',
    'manage_programs',
    'view_analytics',
    'delete_content',
    'approve_experts',
    'manage_blog',
    'manage_testimonials'
  ],
  'content': ['manage_content', 'manage_blog'],
  'support': ['view_analytics', 'manage_users'],
  'editor': ['manage_content', 'manage_blog', 'manage_testimonials']
};

export interface AdminUser {
  id: string;
  email: string | null;
  role: string;
  permissions: AdminPermission[];
  name?: string;
  createdAt?: string;
}

export interface AdminAuthState {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface AdminAuthContextType extends AdminAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile?: (updates: Partial<AdminUser>) => Promise<boolean>;
}

export const initialAdminAuthState: AdminAuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};
