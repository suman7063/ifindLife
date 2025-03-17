
// Export the context and provider from separate files
import { UserAuthContext, UserAuthContextType } from './UserAuthContext';
import { UserAuthProvider } from './UserAuthProvider';
import { useUserAuth } from '@/hooks/useUserAuth';

// Re-export for convenience
export { UserAuthContext, UserAuthProvider, useUserAuth };
export type { UserAuthContextType };

// Re-export types from the original context
export type { UserProfile, Expert } from '@/types/supabase';
export type { Review, Report } from '@/types/supabase/reviews';
export type { Course, UserTransaction } from '@/types/supabase';
export type { User } from '@/types/supabase';
