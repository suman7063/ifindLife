
// Re-export context and provider
export { AuthContext, AuthProvider, useAuth } from './AuthContext';

// Re-export types
export type { 
  UserProfile, 
  ExpertProfile, 
  UserRole, 
  AuthContextType, 
  AuthState,
  AuthStatus
} from './types';

// Re-export hooks
export { useAuthState } from './hooks/useAuthState';
export { useAuthActions } from './hooks/useAuthActions';
export { useProfileFunctions } from './hooks/useProfileFunctions';
export { useAuthMethods } from './hooks/useAuthMethods';

// Re-export user auth context
export { UserAuthContext, UserAuthProvider, useUserAuth } from './UserAuthContext';
