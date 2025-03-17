// Review status type
export interface ReviewStatus {
  canReview: boolean;
  hasReviewed: boolean;
}

// Other review-related types
export interface ReviewUI {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
  expertName?: string;
}

export interface ReviewDB {
  id: string;
  user_id: string;
  expert_id: number; // In database, stored as number
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
}
