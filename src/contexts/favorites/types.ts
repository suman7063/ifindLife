
export interface FavoritesContextType {
  // Expert favorites (also used as generic favorites for backward compatibility)
  favorites: number[];
  expertFavorites: number[];
  isExpertFavorite: (expertId: number) => boolean;
  toggleExpertFavorite: (expertId: number) => Promise<boolean>;
  addFavorite: (expertId: number) => Promise<boolean>; // Keep for backward compatibility
  removeFavorite: (expertId: number) => Promise<boolean>; // Keep for backward compatibility
  
  // Program favorites
  programFavorites: number[];
  isProgramFavorite: (programId: number) => boolean;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
  
  // Status
  loading: boolean;
}
