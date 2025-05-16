
import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context || Object.keys(context).length === 0) {
    console.error('useAuth must be used within an AuthProvider, current context:', context);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('useAuth hook called, login function available:', !!context.login);
  
  return context;
};
