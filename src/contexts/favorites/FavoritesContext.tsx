
import React, { createContext, useContext } from 'react';
import { FavoritesContextType } from './types';

// Create context with default values
export const FavoritesContext = createContext<FavoritesContextType>({
  // Original properties
  favorites: [],
  loading: false,
  error: null,
  
  // New properties
  expertFavorites: [],
  programFavorites: [],
  expertFavoriteDetails: [],
  programFavoriteDetails: [],
  
  isExpertFavorite: () => false,
  isProgramFavorite: () => false,
  
  toggleExpertFavorite: async () => false,
  toggleProgramFavorite: async () => false
});

// Export hook for using the favorites context
export const useFavorites = () => useContext(FavoritesContext);

// Re-export the FavoritesProvider from separate file
export { FavoritesProvider } from './FavoritesProvider';
