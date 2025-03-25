
import { createContext } from 'react';
import { UserAuthContextType } from './types';

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);
