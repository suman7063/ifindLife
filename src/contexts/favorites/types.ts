
import { Expert } from '@/types/expert';

export interface FavoritesContextType {
  // Original properties for backward compatibility
  favorites: string[];
  loading: boolean;
  error?: Error | null;
  addFavorite?: (expertId: string) => Promise<boolean>;
  removeFavorite?: (expertId: string) => Promise<boolean>;
  isFavorite?: (expertId: string) => boolean;
  
  // New properties for enhanced functionality - expert IDs are now UUIDs (strings)
  expertFavorites: string[];
  programFavorites: number[];
  expertFavoriteDetails: Array<{ id: string, name: string }>;
  programFavoriteDetails: Array<{ id: number, title: string }>;
  
  isExpertFavorite: (expertId: string) => boolean;
  isProgramFavorite: (programId: number) => boolean;
  
  toggleExpertFavorite: (expertId: string) => Promise<boolean>;
  toggleProgramFavorite: (programId: number) => Promise<boolean>;
}
