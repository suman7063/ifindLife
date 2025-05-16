
import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context || Object.keys(context).length === 0) {
    console.error('useAuth must be used within an AuthProvider, current context:', context);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Log the available properties including login function
  if (process.env.NODE_ENV !== 'production') {
    console.log('useAuth hook called, context properties:', {
      hasLogin: !!context.login,
      loginType: typeof context.login,
      isAuthenticated: context.isAuthenticated,
      role: context.role,
      availableKeys: Object.keys(context)
    });
  }
  
  return context;
};
