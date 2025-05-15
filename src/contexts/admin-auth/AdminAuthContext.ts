
import { createContext } from 'react';
import { AdminUser, AdminAuthContextType } from './types';

// Create context with proper typing
export const AdminAuthContext = createContext<AdminAuthContextType>({} as AdminAuthContextType);
