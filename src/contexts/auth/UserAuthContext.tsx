
import React from 'react';
import { UserAuthContextType } from './types';

// Create and export the context
export const UserAuthContext = React.createContext<UserAuthContextType>({} as UserAuthContextType);
