
import { createContext, useContext } from 'react';
import { FavoritesContextType } from './types';

// Create the context with default values
export const FavoritesContext = createContext<FavoritesContextType>({
  // Expert favorites (for backward compatibility)
  favorites: [],
  expertFavorites: [],
  isExpertFavorite: () => false,
  toggleExpertFavorite: async () => false,
  addFavorite: async () => false,
  removeFavorite: async () => false,
  
  // Program favorites
  programFavorites: [],
  isProgramFavorite: () => false,
  toggleProgramFavorite: async () => false,
  
  // Detailed favorites
  expertFavoriteDetails: [],
  programFavoriteDetails: [],
  
  // Status
  loading: false
});

// Hook to access the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// Safe version that doesn't throw an error
export const useSafeFavorites = () => {
  return useContext(FavoritesContext);
};
