
// Re-export everything from separate files
import { UserAuthContext, UserAuthContextType } from './UserAuthContext';
import { UserAuthProvider } from './UserAuthProvider';
import { useUserAuth } from '@/hooks/useUserAuth';

// Re-export for backward compatibility
export { UserAuthContext, UserAuthProvider, useUserAuth };
export type { UserAuthContextType };

// Re-export types from the original context
export type { UserProfile, Expert, Review, Report, Course, UserTransaction, User } from '@/types/supabase';
