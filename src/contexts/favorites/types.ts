
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
  
  // Detailed favorites
  expertFavoriteDetails: Array<{ id: number, name: string }>;
  programFavoriteDetails: Array<{ id: number, title: string }>;
  
  // Status
  loading: boolean;
}
