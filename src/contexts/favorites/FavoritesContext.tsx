
import { createContext, useContext } from 'react';

// Define the FavoritesContext type
export interface FavoritesContextType {
  isExpertFavorite?: (id: number) => boolean;
  toggleExpertFavorite?: (id: number) => Promise<void>;
  isProgramFavorite?: (id: number) => boolean;
  toggleProgramFavorite?: (id: number) => Promise<void>;
  favoriteExperts?: number[];
  favoritePrograms?: number[];
  loading?: boolean;
}

// Create the context with default values
export const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Safe hook to access the favorites context
export const useSafeFavorites = () => {
  const context = useContext(FavoritesContext);
  // Return the context even if null - caller will handle this case
  return context;
};

// Original hook that throws if used outside provider
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
