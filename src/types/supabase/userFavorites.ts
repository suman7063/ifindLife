
import { Expert } from './expert';

// Create a separate type for user favorites to avoid circular references
export interface UserFavorite {
  id: string;
  user_id?: string;
  expert_id: number;
}

export interface UserFavoriteWithExpert extends UserFavorite {
  expert: Expert;
}
