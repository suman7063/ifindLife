
// Import UserReview from tables
import type { UserReview } from './tables';

export type { UserReview };

export interface ReviewStats {
  averageRating: number;
  totalCount: number;
  ratingCounts: Record<number, number>;
}
