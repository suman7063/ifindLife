
export interface FavoritesContextType {
  favorites: number[];
  loading: boolean;
  addFavorite: (expertId: number) => Promise<boolean>;
  removeFavorite: (expertId: number) => Promise<boolean>;
  isExpertFavorite: (expertId: number) => boolean;
  toggleExpertFavorite: (expertId: number) => Promise<boolean>;
  expertFavorites: number[];
  programFavorites: number[];
  isProgramFavorite: (programId: number) => boolean;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
}
