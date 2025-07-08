// Redirect all auth imports to SimpleAuthContext for consistency
export { useSimpleAuth as useAuth } from '@/contexts/SimpleAuthContext';
export type { SimpleAuthContextType as AuthContextType } from '@/contexts/SimpleAuthContext';