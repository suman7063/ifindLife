
// This file is maintained for backward compatibility
// It re-exports everything from the refactored structure
import { UserAuthProvider, UserAuthContext, useUserAuth } from './auth';
import type { UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction, User } from './auth';

export { UserAuthProvider, UserAuthContext, useUserAuth };
export type { UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction, User };
