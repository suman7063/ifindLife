
import React from 'react';
import { UserAuthContextType } from './auth/types';

// Create and export the context
export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
