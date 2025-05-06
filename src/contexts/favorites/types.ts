
export interface FavoritesContextType {
  // Original properties
  favoriteExperts: string[];
  favoritePrograms: number[];
  isLoading: boolean;
  addExpertToFavorites: (expertId: string) => Promise<void>;
  removeExpertFromFavorites: (expertId: string) => Promise<void>;
  addProgramToFavorites: (programId: number) => Promise<void>;
  removeProgramFromFavorites: (programId: number) => Promise<void>;
  isExpertFavorite: (expertId: string) => boolean;
  isProgramFavorite: (programId: number) => boolean;
  
  // Added properties for backward compatibility
  expertFavorites: string[];
  programFavorites: number[];
  toggleExpertFavorite: (expertId: string) => Promise<boolean>;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
}
