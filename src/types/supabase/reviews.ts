
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
  userName?: string;
  userId?: string;
}

// Alias Review to ReviewUI for backward compatibility
export type Review = ReviewUI;

// Report interface
export interface ReportUI {
  id: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
}

// Alias Report to ReportUI for backward compatibility
export type Report = ReportUI;

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
