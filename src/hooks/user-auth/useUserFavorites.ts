
import { UserFavoritesHookReturn } from './types/favorites';
import { useFavoritesFetcher } from './favorites/useFavoritesFetcher';
import { useProgramFavorites } from './favorites/useProgramFavorites';
import { useExpertFavorites } from './favorites/useExpertFavorites';

// Re-export types with 'export type'
export type { FavoriteProgram, FavoriteExpert } from './types/favorites';

export const useUserFavorites = (userId?: string): UserFavoritesHookReturn => {
  // Use the fetcher hook to get favorites data
  const {
    favoritePrograms,
    favoriteExperts,
    setFavoritePrograms,
    setFavoriteExperts,
    loading,
    error,
    fetchFavorites
  } = useFavoritesFetcher(userId);
  
  // Use program favorites hooks
  const {
    addProgramToFavorites,
    removeProgramFromFavorites
  } = useProgramFavorites(userId, favoritePrograms, setFavoritePrograms, fetchFavorites);
  
  // Use expert favorites hooks
  const {
    addExpertToFavorites,
    removeExpertFromFavorites,
    toggleExpertFavorite
  } = useExpertFavorites(userId, favoriteExperts, setFavoriteExperts, fetchFavorites);

  return {
    favoritePrograms,
    favoriteExperts,
    loading,
    error,
    addProgramToFavorites,
    removeProgramFromFavorites,
    toggleExpertFavorite,
    addExpertToFavorites,
    removeExpertFromFavorites
  };
};
