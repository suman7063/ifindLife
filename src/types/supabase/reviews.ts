
// We'll import UserReview from tables to avoid duplication
import { UserReview } from './tables';

export type { UserReview };

export interface ReviewStats {
  averageRating: number;
  totalCount: number;
  ratingCounts: Record<number, number>;
}
