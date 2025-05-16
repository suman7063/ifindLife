
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
    
    // Check if login exists but is not a function
    if (context.login !== undefined && typeof context.login !== 'function') {
      console.error('Login is defined but not a function:', context.login);
    }
  }
  
  // Create a fallback login function if it's missing
  if (!context.login || typeof context.login !== 'function') {
    console.error('Login function missing from auth context. Creating a fallback that will fail.');
    // @ts-ignore - Adding fallback login function
    context.login = async () => {
      console.error('Using fallback login function which always fails');
      return false;
    };
  }
  
  return context;
};
