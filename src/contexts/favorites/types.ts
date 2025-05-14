
import { Expert } from '@/types/expert';

export interface FavoritesContextType {
  // Original properties for backward compatibility
  favorites: number[];
  loading: boolean;
  error?: Error | null;
  addFavorite?: (expertId: number) => Promise<boolean>;
  removeFavorite?: (expertId: number) => Promise<boolean>;
  isFavorite?: (expertId: number) => boolean;
  
  // New properties for enhanced functionality
  expertFavorites: number[];
  programFavorites: number[];
  expertFavoriteDetails: Array<{ id: number, name: string }>;
  programFavoriteDetails: Array<{ id: number, title: string }>;
  
  isExpertFavorite: (expertId: number) => boolean;
  isProgramFavorite: (programId: number) => boolean;
  
  toggleExpertFavorite: (expertId: number) => Promise<boolean>;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
}
