
import { Expert } from '@/types/expert';

export interface FavoriteProgram {
  id: string;
  program_id: number;
  user_id: string;
}

export interface FavoriteExpert {
  id: string;
  expert_id: string;
  user_id: string;
}

export interface UserFavoritesHookReturn {
  favoritePrograms: FavoriteProgram[];
  favoriteExperts: FavoriteExpert[];
  loading: boolean;
  error: Error | null;
  addProgramToFavorites: (programId: number) => Promise<boolean>;
  removeProgramFromFavorites: (programId: number) => Promise<boolean>;
  toggleExpertFavorite: (expert: Expert) => Promise<boolean>;
  addExpertToFavorites: (expert: Expert) => Promise<boolean>;
  removeExpertFromFavorites: (expert: Expert) => Promise<boolean>;
}
