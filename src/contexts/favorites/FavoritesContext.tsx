
import { createContext, useContext } from 'react';
import { FavoritesContextType } from './types';

// Create favorites context with default values
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Hook for using favorites context with better error message
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider. Check component hierarchy to ensure this component is wrapped in FavoritesProvider.');
  }
  
  return context;
};

// Safe version of useFavorites that doesn't throw an error
export const useSafeFavorites = () => {
  return useContext(FavoritesContext);
};
