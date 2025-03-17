
// Using interfaces for UI-friendly models
export interface Review {
  id: string;
  expertId: string;
  expertName?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  userId?: string;
  userName?: string;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

// For compatibility with the database schema that uses numbers for IDs
export interface ReviewStatus {
  canReview: boolean;
  hasReviewed: boolean;
}
