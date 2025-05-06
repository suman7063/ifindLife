
import { createContext, useContext } from 'react';
import { FavoritesContextType } from './types';

// Create favorites context with default values
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Hook for using favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
};
