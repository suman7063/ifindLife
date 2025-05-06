
import { toast } from 'sonner';

export const handleAuthError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('Auth error:', error);
  
  // Handle common Supabase auth errors
  if (error.code === 'invalid_credentials') {
    toast.error('Invalid email or password');
    return;
  }
  
  if (error.code === 'email_already_in_use' || error.message?.includes('already taken')) {
    toast.error('Email is already registered');
    return;
  }
  
  if (error.code === 'invalid_claim') {
    toast.error('Your session has expired. Please log in again.');
    return;
  }
  
  if (error.code === 'invalid_token') {
    toast.error('Your login token has expired. Please log in again.');
    return;
  }
  
  if (error.code === 'rate_limit_exceeded') {
    toast.error('Too many attempts. Please try again later.');
    return;
  }
  
  // Handle database or other errors
  if (error.code === '23505' || error.message?.includes('unique constraint')) {
    toast.error('An account with this email already exists');
    return;
  }
  
  // Default error handler
  toast.error(error.message || defaultMessage);
};

/**
 * Extracts user role from the user object or user metadata
 */
export const getUserRole = (user: any): string | null => {
  if (!user) return null;
  
  // Try to get role from user metadata
  const userMetadata = user.user_metadata || {};
  if (userMetadata.role) return userMetadata.role;
  
  // Try to get role from app_metadata
  const appMetadata = user.app_metadata || {};
  if (appMetadata.role) return appMetadata.role;
  
  return null;
};

/**
 * Check if user has expert access
 */
export const isExpert = (user: any): boolean => {
  if (!user) return false;
  
  // Check metadata for user_type = expert
  const metadata = user.user_metadata || {};
  if (metadata.user_type === 'expert') return true;
  
  // Check for explicit expert role
  const role = getUserRole(user);
  return role === 'expert';
};
