
// Consolidated auth utilities
export { ensureUserProfileCompatibility } from '../typeAdapters';
export { useAuthProtection } from '../authProtection';

// Auth types and interfaces
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token?: string;
}

// Auth constants
export const AUTH_STORAGE_KEY = 'supabase.auth.token';
export const ADMIN_SESSION_KEY = 'clean_admin_session';
