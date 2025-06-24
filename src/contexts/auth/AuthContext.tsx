
// Re-export the unified auth context for backward compatibility
export { useAuth, UnifiedAuthProvider as AuthProvider } from './UnifiedAuthContext';
export type { UnifiedAuthContextType as AuthContextType } from './UnifiedAuthContext';

// Create a compatibility context that just re-exports the unified context
import { createContext } from 'react';
import type { UnifiedAuthContextType } from './UnifiedAuthContext';

export const AuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);
