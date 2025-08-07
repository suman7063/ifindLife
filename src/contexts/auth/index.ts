// Primary auth exports - SimpleAuth for users/experts
export { useSimpleAuth as useAuth } from '@/contexts/SimpleAuthContext';
export type { SimpleAuthContextType as AuthContextType } from '@/contexts/SimpleAuthContext';

// Direct exports for backward compatibility
export { useSimpleAuth } from '@/contexts/SimpleAuthContext';
export type { SimpleAuthContextType } from '@/contexts/SimpleAuthContext';